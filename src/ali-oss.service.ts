import { Inject, Injectable, Logger } from '@nestjs/common';
import { Options } from 'ali-oss';
import * as OSS from 'ali-oss';

import { ALI_OSS_OPTIONS, TAG } from './contants';
import {
  AliOSSOptions,
  DeleteResult,
  PutObjectOptions,
  PutObjectResult,
  ListObjectsQuery,
  OSSRequestOptions,
  PutStreamOptions,
  ListV2ObjectsQuery,
  GetStreamOptions,
  OSSUserMeta,
  DeleteMultiOptions,
  SignatureUrlOptions,
  InitMultipartUploadOptions,
  ListPartsQuery,
  MultipartUploadOptions,
  MultipartUploadCopySourceData,
} from './interface';

@Injectable()
export class AliOssService {
  private readonly logger = new Logger(`[${TAG}]-${AliOssService.name}`);
  private clients: { [bucket: string]: OSS } = {};
  private defaultOptions: Options;

  constructor(
    @Inject(ALI_OSS_OPTIONS)
    private readonly options: AliOSSOptions,
  ) {
    if (
      options.accessKeyId &&
      options.accessKeySecret &&
      options.region &&
      typeof options.bucket === 'string'
    ) {
      this.defaultOptions = options as Options;
      this.clients[options.bucket] = new OSS(options as Options);
    }
    this.logger.log(`[${TAG}] AliOssService client init`);
  }

  private getClient(bucket: string): OSS {
    if (!bucket) {
      if (this.defaultOptions) {
        bucket = this.defaultOptions.bucket;
      } else {
        this.logger.error(
          `[${TAG}] AliOssService client init error, error bucket: ${bucket}`,
        );
        throw new Error(
          `[${TAG}] AliOssService client init error, error bucket: ${bucket}`,
        );
      }
    }
    if (!this.clients[bucket]) {
      if (
        this.options[bucket] == null &&
        typeof this.options[bucket] === 'object'
      ) {
        this.clients[bucket] = new OSS(this.options[bucket]);
      } else if (
        this.options.bucket != null &&
        this.options.bucket === bucket
      ) {
        this.clients[bucket] = new OSS(this.options as Options);
      } else {
        this.logger.error(
          `[${TAG}] AliOssService client init error, error bucket: ${bucket}`,
        );
        throw new Error(
          `[${TAG}] AliOssService client init error, error bucket: ${bucket}`,
        );
      }
    }
    return this.clients[bucket];
  }

  async put(
    name: string,
    file: any,
    options?: PutObjectOptions & { bucket?: string },
  ): Promise<PutObjectResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.put(name, file, options);
    this.logger.debug(
      `[${TAG}] AliOssService put ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async delete(
    name: string,
    options?: { bucket?: string },
  ): Promise<DeleteResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.delete(name);
    this.logger.debug(
      `[${TAG}] AliOssService delete ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async list(
    query: ListObjectsQuery | null,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.ListObjectResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.list(query, options);
    this.logger.debug(
      `[${TAG}] AliOssService list ${JSON.stringify(query)} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async listV2(
    query: ListV2ObjectsQuery | null,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.ListObjectResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.listV2(query, options);
    this.logger.debug(
      `[${TAG}] AliOssService listV2 ${JSON.stringify(query)} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async head(
    name: string,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.HeadObjectResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.head(name, options);
    this.logger.debug(
      `[${TAG}] AliOssService head ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async copy(
    name: string,
    sourceName: string,
    options?: { bucket?: string; sourceBucket?: string } & OSSRequestOptions,
  ): Promise<OSS.CopyAndPutMetaResult> {
    const bucket = options?.bucket;
    const sourceBucket = options?.sourceBucket;
    const client = this.getClient(bucket);
    let result: OSS.CopyAndPutMetaResult;
    if (sourceBucket) {
      result = await client.copy(name, sourceName, sourceBucket, options);
    } else {
      result = await client.copy(name, sourceName, options);
    }
    this.logger.debug(
      `[${TAG}] AliOssService copy ${sourceName} to ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async putStream(
    name: string,
    stream: any,
    options?: { bucket?: string } & PutStreamOptions,
  ): Promise<{
    name: string;
    res: OSS.NormalSuccessResponse;
  }> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.putStream(name, stream, options);
    this.logger.debug(
      `[${TAG}] AliOssService putStream ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async get(
    name: string,
    file?: any,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.GetObjectResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.get(name, file, options);
    this.logger.debug(
      `[${TAG}] AliOssService get ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async getStream(
    name: string,
    options?: { bucket?: string } & GetStreamOptions,
  ): Promise<OSS.GetStreamResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.getStream(name, options);
    this.logger.debug(
      `[${TAG}] AliOssService getStream ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async putMeta(
    name: string,
    meta: OSSUserMeta,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.CopyAndPutMetaResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.putMeta(name, meta, options);
    this.logger.debug(
      `[${TAG}] AliOssService putMeta ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async deleteMulti(
    names: string[],
    options?: { bucket?: string } & DeleteMultiOptions,
  ): Promise<OSS.DeleteMultiResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.deleteMulti(names, options);
    this.logger.debug(
      `[${TAG}] AliOssService deleteMulti ${names} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async signatureUrl(
    name: string,
    options?: { bucket?: string } & SignatureUrlOptions,
  ): Promise<string> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.signatureUrl(name, options);
    this.logger.debug(
      `[${TAG}] AliOssService signatureUrl ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async initMultipartUpload(
    name: string,
    options?: { bucket?: string } & InitMultipartUploadOptions,
  ): Promise<OSS.InitMultipartUploadResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.initMultipartUpload(name, options);
    this.logger.debug(
      `[${TAG}] AliOssService initMultipartUpload ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async uploadPart(
    name: string,
    uploadId: string,
    partNo: number,
    file: any,
    start?: number,
    end?: number,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.UploadPartResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.uploadPart(
      name,
      uploadId,
      partNo,
      file,
      start,
      end,
      options,
    );
    this.logger.debug(
      `[${TAG}] AliOssService uploadPart name: ${name} uploadId: ${uploadId} partNo: ${partNo} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async listParts(
    name: string,
    uploadId: string,
    query?: ListPartsQuery,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.ListPartsResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.listParts(name, uploadId, query, options);
    this.logger.debug(
      `[${TAG}] AliOssService listParts ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async completeMultipartUpload(
    name: string,
    uploadId: string,
    parts: {
      number: number;
      etag: string;
    }[],
    options?: { bucket?: string } & MultipartUploadOptions,
  ): Promise<OSS.CompleteMultipartUploadResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.completeMultipartUpload(
      name,
      uploadId,
      parts,
      options,
    );
    this.logger.debug(
      `[${TAG}] AliOssService completeMultipartUpload ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async multipartUpload(
    name: string,
    file: any,
    options?: { bucket?: string } & MultipartUploadOptions,
  ): Promise<OSS.MultipartUploadResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.multipartUpload(name, file, options);
    this.logger.debug(
      `[${TAG}] AliOssService multipartUpload ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async multipartUploadCopy(
    name: string,
    sourceData: MultipartUploadCopySourceData,
    options?: { bucket?: string } & MultipartUploadOptions,
  ): Promise<OSS.MultipartUploadCopyResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.multipartUploadCopy(name, sourceData, options);
    this.logger.debug(
      `[${TAG}] AliOssService multipartUploadCopy ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async listUploads(
    query: OSS.ListUploadsQuery,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.ListUploadsResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.listUploads(query, options);
    this.logger.debug(
      `[${TAG}] AliOssService listUploads ${JSON.stringify(query)} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async abortMultipartUpload(
    name: string,
    uploadId: string,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.NormalSuccessResponse> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.abortMultipartUpload(name, uploadId, options);
    this.logger.debug(
      `[${TAG}] AliOssService abortMultipartUpload ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async uploadPartCopy(
    params: {
      name: string;
      uploadId: string;
      partNo: number;
      range: string;
      sourceData: {
        sourceKey: string;
        sourceBucketName: string;
      };
    },
    options?: { bucket?: string; headers?: any } & OSSRequestOptions,
  ): Promise<OSS.UploadPartResult> {
    const bucket = options?.bucket;
    const { name, uploadId, partNo, range, sourceData } = params;
    const client = this.getClient(bucket);
    const result = await client.uploadPartCopy(
      name,
      uploadId,
      partNo,
      range,
      sourceData,
      options,
    );
    this.logger.debug(
      `[${TAG}] AliOssService uploadPartCopy ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async restore(
    name: string,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.NormalSuccessResponse> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.restore(name, options);
    this.logger.debug(
      `[${TAG}] AliOssService restore ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }

  async append(
    name: string,
    file: any,
    options?: { bucket?: string } & OSSRequestOptions,
  ): Promise<OSS.AppendObjectResult> {
    const bucket = options?.bucket;
    const client = this.getClient(bucket);
    const result = await client.append(name, file, options);
    this.logger.debug(
      `[${TAG}] AliOssService append ${name} result: ${JSON.stringify(result)}`,
    );
    return result;
  }
}
