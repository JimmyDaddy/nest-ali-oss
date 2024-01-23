import { Options } from 'ali-oss';

export {
  DeleteResult,
  PutObjectOptions,
  PutObjectResult,
  ListObjectsQuery,
  ListObjectResult,
  RequestOptions as OSSRequestOptions,
  PutStreamOptions,
  ListV2ObjectsQuery,
  GetStreamOptions,
  UserMeta as OSSUserMeta,
  DeleteMultiOptions,
  SignatureUrlOptions,
  InitMultipartUploadOptions,
  ListPartsQuery,
  MultipartUploadOptions,
  MultipartUploadCopySourceData,
} from 'ali-oss';

export type AliOSSOptions =
  | {
      [key: string]: Options;
    }
  | Options;
