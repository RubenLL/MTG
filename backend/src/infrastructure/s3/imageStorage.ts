// Infrastructure adapter for S3 image storage
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { CardId } from '../../domain/valueObjects';

/**
 * S3 implementation for MTG card image storage
 * Handles storing and retrieving card images
 */
export class S3ImageStorageAdapter {
  private readonly client: S3Client;
  private readonly bucketName: string;

  constructor(bucketName: string = 'mtg-card-images') {
    this.client = new S3Client({});
    this.bucketName = bucketName;
  }

  /**
   * Get image URL for a card
   * @param cardId Card ID to get image for
   * @returns Promise with image URL or null if not found
   */
  async getImageUrl(cardId: CardId): Promise<string | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: `${cardId.toString()}.jpg`,
      });

      await this.client.send(command);

      // Return the public URL if object exists
      return `https://${this.bucketName}.s3.amazonaws.com/${cardId.toString()}.jpg`;
    } catch (error) {
      // Object doesn't exist
      return null;
    }
  }

  /**
   * Upload card image
   * @param cardId Card ID for the image
   * @param imageBuffer Image data buffer
   * @param contentType Image content type (e.g., 'image/jpeg')
   * @returns Promise that resolves when uploaded
   */
  async uploadImage(
    cardId: CardId,
    imageBuffer: Buffer,
    contentType: string = 'image/jpeg'
  ): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `${cardId.toString()}.jpg`,
        Body: imageBuffer,
        ContentType: contentType,
        Metadata: {
          cardId: cardId.toString(),
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Download card image
   * @param cardId Card ID to download image for
   * @returns Promise with image buffer or null if not found
   */
  async downloadImage(cardId: CardId): Promise<Buffer | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: `${cardId.toString()}.jpg`,
      });

      const response = await this.client.send(command);

      if (response.Body) {
        // Handle different Body types from AWS SDK
        if (Buffer.isBuffer(response.Body)) {
          // Body is already a Buffer
          return response.Body;
        } else if (typeof response.Body === 'string') {
          // Body is a string, convert to Buffer
          return Buffer.from(response.Body);
        } else {
          // Body is a ReadableStream, convert to buffer
          const stream = response.Body as NodeJS.ReadableStream;
          const chunks: Buffer[] = [];

          for await (const chunk of stream) {
            // Ensure each chunk is converted to Buffer
            if (Buffer.isBuffer(chunk)) {
              chunks.push(chunk);
            } else if (typeof chunk === 'string') {
              chunks.push(Buffer.from(chunk));
            } else {
              // Handle other types by converting to string first
              chunks.push(Buffer.from(String(chunk)));
            }
          }

          return Buffer.concat(chunks);
        }
      }

      return null;
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  }

  /**
   * Delete card image
   * @param cardId Card ID to delete image for
   * @returns Promise that resolves when deleted
   */
  async deleteImage(cardId: CardId): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: `${cardId.toString()}.jpg`,
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Check if image exists
   * @param cardId Card ID to check
   * @returns Promise with boolean indicating if image exists
   */
  async imageExists(cardId: CardId): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: `${cardId.toString()}.jpg`,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Factory function to create S3 image storage adapter
 */
export function createS3ImageStorageAdapter(bucketName?: string): S3ImageStorageAdapter {
  return new S3ImageStorageAdapter(bucketName);
}
