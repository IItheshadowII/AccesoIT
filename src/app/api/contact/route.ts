import {NextResponse} from 'next/server';
import {z} from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({error: 'Invalid input', details: parsed.error.flatten().fieldErrors}, {status: 400});
    }

    const {name, email, message} = parsed.data;

    // Simulate sending an email or saving to a database
    console.log('Contact form submission received:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // In a real application, you would integrate with an email service (e.g., SendGrid, Mailgun)
    // or save the data to a database.

    return NextResponse.json({message: 'Form submitted successfully!'}, {status: 200});
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}
