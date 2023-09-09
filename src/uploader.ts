import { PluginSettings } from "./setting";
import { streamToString, getLastImage } from "./utils";
import { exec, spawnSync, spawn } from "child_process";
import { Notice, requestUrl, FileSystemAdapter } from "obsidian";
import autoImageRemoteUploaderPlugin from "./main";
import { IStringKeyMap } from "./utils";
import ApiError from "./ApiError";
import { lookup, contentType, extension, charset, types } from "es-mime-types";
import { Image } from "./helper";
export interface ApiResponse {
  success: boolean;
  code: number;
  status: number;
  msg: string;
  data: {
    imageurl: string;
  };
}

export async function handleApiResponseError(resp: Response): Promise<void> {
  if (resp.headers.get("Content-Type") === "application/json") {
    throw new ApiError(((await resp.json()) as ApiResponse).msg);
  }
  throw new Error(await resp.text());
}

export class RemoteUploader {
  settings: PluginSettings;
  plugin: autoImageRemoteUploaderPlugin;

  constructor(settings: PluginSettings, plugin: autoImageRemoteUploaderPlugin) {
    this.settings = settings;
    this.plugin = plugin;
  }

  async uploadUrlFile(filename: String): Promise<any> {
    let formData = new FormData();

    formData.append("name", filename.format());

    const response = await fetch(this.settings.imageApi, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });

    if (!response.ok) {
      await handleApiResponseError(response);
    }

    let res = (await response.json()) as ApiResponse;

    console.log("uploadFile response", res);

    res.success = true;

    this.settings.uploadedImages = [
      ...(this.settings.uploadedImages || []),
      res.data.imageurl,
    ];

    return res;
  }

  async uploadFileByBlob(content: ArrayBuffer, ufile: Image): Promise<any> {
    console.log(ufile, lookup(ufile));

    let requestData = new FormData();
    let blob = new Blob([content], { type: lookup(ufile) });

    let file = new File([blob], ufile.originalPath);

    requestData.append("imagefile", file);

    const response = await fetch(this.settings.imageApi, {
      method: "POST",
      headers: new Headers({ Authorization: `Client-ID` }),
      body: requestData,
    });

    if (!response.ok) {
      await handleApiResponseError(response);
    }

    let res = (await response.json()) as ApiResponse;

    console.log("uploadFileByClipboard response", res);

    res.success = true;

    this.settings.uploadedImages = [
      ...(this.settings.uploadedImages || []),
      res.data.imageurl,
    ];

    return res;
  }

  async uploadFile(image: File): Promise<any> {
    let requestData = new FormData();
    requestData.append("imagefile", image);

    const response = await fetch(this.settings.imageApi, {
      method: "POST",
      headers: new Headers({ Authorization: `Client-ID` }),
      body: requestData,
    });

    if (!response.ok) {
      await handleApiResponseError(response);
    }

    let res = (await response.json()) as ApiResponse;

    console.log("uploadFileByClipboard response", res);

    res.success = true;

    this.settings.uploadedImages = [
      ...(this.settings.uploadedImages || []),
      res.data.imageurl,
    ];

    return res;
  }

  async deleteImage(configMap: IStringKeyMap<any>[]) {
    const response = await requestUrl({
      url: this.plugin.settings.imageApi,
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        list: configMap,
      }),
    });
    const data = response.json;
    return data;
  }
}
