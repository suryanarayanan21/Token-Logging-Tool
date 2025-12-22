import { BlobServiceClient } from "@azure/storage-blob";

export class FileClient {
  constructor(connectionString) {
    this.fileFolder = "Token Logging Tool"
    this.client = BlobServiceClient.fromConnectionString(connectionString);
    this.container = this.client.getContainerClient("file");
  }

  /**
   * Retrieves a file from storage given the URL
   * 
   * @param {string} url URL used to find the file
   * @returns {ReadableStream} A readable stream containing the file contents
   */
  async getFile(url) {
    console.log(`Attempting to download file with url: ${url}`);
    const blobClient = this.container.getBlockBlobClient(`${this.fileFolder}/${url}`);
    const downloadResponse = await blobClient.download(0);
    return downloadResponse.readableStreamBody;
  }

  /**
   * Uploads a readable stream to storage
   * 
   * @param {ReadableStream} stream 
   * @returns URL that can be used to access the uploaded stream
   */
  async uploadFile(stream) {
    const uuid = crypto.randomUUID();
    const blobClient = this.container.getBlockBlobClient(`${this.fileFolder}/${uuid}`);
    await blobClient.uploadStream(stream);
    return uuid;
  }
}