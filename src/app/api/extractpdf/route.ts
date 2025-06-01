
import { NextRequest, NextResponse } from 'next/server';
import { pdfToText } from 'pdf-ts';

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const file = data.get('resume') as File;
        console.log('Received file:', file);
        console.log('File type:', file?.type);
    if (!file || file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await pdfToText(buffer);
    return NextResponse.json({ text });
}
