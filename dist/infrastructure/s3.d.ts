import { S3Client } from "@aws-sdk/client-s3";
declare global {
    var cachedS3: S3Client;
}
declare let S3: S3Client;
export default S3;
