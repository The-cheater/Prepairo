import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'kskx0jpz',
  api_key: process.env.CLOUDINARY_API_KEY || '922275931553238',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5yyyi1A-nXdLFdvje97JiK12lq4',
  secure: true
});

export default cloudinary;

/**
 * Format paper file name strictly according to: subject_midsem/endsem_year.pdf
 * e.g., "PrinciplesOfLifeI_midsem_2024.pdf"
 */
export function formatPaperFileName(subjectName: string, examType: string, examYear: number): string {
  const cleanSubject = subjectName
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim();
  
  const cleanExamType = examType
    .toLowerCase()
    .replace('-', '')
    .replace(/[^a-z0-9]/g, '');

  return `${cleanSubject}_${cleanExamType}_${examYear}.pdf`;
}

/**
 * Upload buffer to Cloudinary with explicit public_id matching the formatted name
 */
export async function uploadPdfToCloudinary(
  buffer: Buffer,
  formattedFileName: string
): Promise<{ secureUrl: string; publicId: string; bytes: number }> {
  const publicIdWithoutExt = formattedFileName.replace(/\.pdf$/i, '');

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'iiser_tvm_pyq',
        public_id: publicIdWithoutExt,
        resource_type: 'raw',
        format: 'pdf',
        overwrite: true
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Failed to upload file to Cloudinary'));
        } else {
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}
