export type CustomFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

const readPdf = async (file: CustomFile) => {
  return new Promise(async (resolve, reject) => {
    const pdfreader = await import("pdfreader");
    const pdfReader = new pdfreader.PdfReader(null);
    const items: string[] = [];
    pdfReader.parseBuffer(file.buffer, (err: any, item: any) => {
      if (err) {
        reject(err);
      } else if (!item) {
        resolve(items);
      } else if (item.text) {
        items.push(item.text);
      }
    });
  });
};
export default readPdf;
