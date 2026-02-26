const supabase = require('../config/database');
const { logger } = require('../utils/logger');
const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_xxxxx'
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

// Helper function to generate the 000000001-2026 format ID
async function generateComplaintNumber() {
    const year = new Date().getFullYear();

    // Get the highest complaint number from the database for the current year
    const { data: latestComplaint, error } = await supabase
        .from('ms_complaints')
        .select('complaint_number')
        .like('complaint_number', `%-${year}`)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        logger.error('Error fetching latest complaint:', error);
        throw new Error('Could not generate complaint number');
    }

    let nextNumber = 1;
    if (latestComplaint && latestComplaint.length > 0) {
        // extract the number before the year
        const lastNumberParts = latestComplaint[0].complaint_number.split('-');
        if (lastNumberParts.length === 2) {
            nextNumber = parseInt(lastNumberParts[0], 10) + 1;
        }
    }

    // Pad with leading zeros (e.g., length 9)
    const paddedNumber = String(nextNumber).padStart(9, '0');
    return `${paddedNumber}-${year}`;
}

exports.createComplaint = async (req, res, next) => {
    try {
        const payload = req.body;

        // 1. Generate Complaint Number
        const complaintNumber = await generateComplaintNumber();

        // 2. Insert into DB
        const { data: newComplaint, error: insertError } = await supabase
            .from('ms_complaints')
            .insert({
                complaint_number: complaintNumber,
                consumer_name: payload.consumer_name,
                consumer_id_type: payload.consumer_id_type,
                consumer_id_number: payload.consumer_id_number,
                consumer_address: payload.consumer_address,
                consumer_phone: payload.consumer_phone,
                consumer_email: payload.consumer_email,
                product_type: payload.product_type,
                product_description: payload.product_description,
                complaint_type: payload.complaint_type,
                complaint_details: payload.complaint_details,
                proposed_solution: payload.proposed_solution,
            })
            .select()
            .single();

        if (insertError) {
            logger.error('Supabase error inserting complaint:', insertError);
            throw insertError;
        }

        // 3. Send email to Admins
        if (resend) {
            try {
                await resend.emails.send({
                    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
                    to: ['gloriaquispe@matteosalvatore.pe'],
                    subject: `Nuevo ${payload.complaint_type} - ${complaintNumber}`,
                    html: `
                        <h2>Nueva presentación en el Libro de Reclamaciones</h2>
                        <p><strong>Nro:</strong> ${complaintNumber}</p>
                        <p><strong>Tipo:</strong> ${payload.complaint_type}</p>
                        <p><strong>Cliente:</strong> ${payload.consumer_name}</p>
                        <p><strong>DNI/CE:</strong> ${payload.consumer_id_number}</p>
                        <p><strong>Email:</strong> ${payload.consumer_email}</p>
                        <p><strong>Teléfono:</strong> ${payload.consumer_phone}</p>
                        <hr/>
                        <p><strong>Bien contratado:</strong> ${payload.product_type}</p>
                        <p><strong>Descripción:</strong> ${payload.product_description}</p>
                        <hr/>
                        <p><strong>Detalle:</strong></p>
                        <p>${payload.complaint_details}</p>
                        <hr/>
                        <p><strong>Propuesta de solución:</strong></p>
                        <p>${payload.proposed_solution || 'Ninguna'}</p>
                    `
                });
                logger.info(`Complaint email sent successfully for ${complaintNumber}`);
            } catch (emailError) {
                logger.error('Error sending complaint email notifications:', emailError);
            }
        } else {
            logger.warn('Resend API key missing or placeholder used, skipping email notification');
        }

        res.status(201).json({
            status: 'success',
            data: { complaint: newComplaint }
        });

    } catch (error) {
        next(error);
    }
};

exports.getAllComplaints = async (req, res, next) => {
    try {
        const { data: complaints, error } = await supabase
            .from('ms_complaints')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            logger.error('Error fetching complaints from Supabase:', error);
            throw error;
        }

        res.status(200).json({
            status: 'success',
            data: { complaints }
        });
    } catch (error) {
        next(error);
    }
};
