import { PluginSettings } from "./setting";
import { streamToString, getLastImage } from "./utils";
import { exec, spawnSync, spawn } from "child_process";
import { Notice, requestUrl, FileSystemAdapter } from "obsidian";
import autoImageRemoteUploaderPlugin from "./main";
import { IStringKeyMap } from "./utils";
import ApiError from "./ApiError";
import { lookup, contentType, extension, charset, types } from "es-mime-types";
import { Image } from "./helper";
import { t } from "./lang/helpers";
export interface ApiResponse {
  success: boolean;
  code: number;
  status: boolean;
  message: string;
  data: {
    imageUrl: string;
    imageTitle: string;
  };
}

export async function handleApiResponseServerError(
  resp: Response
): Promise<void> {
  if (resp.headers.get("Content-Type") === "application/json") {
    let errMsg = ((await resp.json()) as ApiResponse).message;
    new Notice(t("Image Upload API error") + ": " + errMsg);
    throw new ApiError(errMsg);
  }
  let errMsg = await resp.text();
  new Notice(t("Image Upload API error") + ": " + errMsg);
  throw new Error(errMsg);
}

export async function handleApiResponse(
  resp: Response,
  settings: PluginSettings
): Promise<ApiResponse> {
  let x = await resp.json();

  if (!x.status) {
    new Notice(t("Image Upload API error") + ": " + x.message);
    return;
  }

  let res: ApiResponse = x as ApiResponse;
  res.success = true;
  res.data.imageTitle = res.data.imageTitle;

  settings.uploadedImages = [
    ...(settings.uploadedImages || []),
    res.data.imageUrl,
  ];

  return res;
}

export class RemoteUploader {
  settings: PluginSettings;
  plugin: autoImageRemoteUploaderPlugin;

  constructor(settings: PluginSettings, plugin: autoImageRemoteUploaderPlugin) {
    this.settings = settings;
    this.plugin = plugin;
  }

  async uploadUrlFile(filename: String): Promise<any> {
    let requestData = new FormData();

    requestData.append("name", filename.format());

    let response;
    try {
      response = await fetch(this.settings.imageApi, {
        method: "POST",
        headers:
          this.settings.imageApiAuth == ""
            ? new Headers()
            : new Headers({ Authorization: this.settings.imageApiAuth }),
        body: requestData,
      });
      // business logic goes here
    } catch (error) {
      new Notice(t("Image Upload API error") + ": " + error.toString());
      return error;
    }

    if (!response.ok) {
      await handleApiResponseServerError(response);
    }
    return await handleApiResponse(response, this.settings);
  }

  async uploadFileByBlob(content: ArrayBuffer, ufile: Image): Promise<any> {
    console.log(ufile, lookup(ufile));

    let requestData = new FormData();
    let blob = new Blob([content], { type: lookup(ufile) });

    let file = new File([blob], ufile.originalPath);

    requestData.append("imagefile", file);

    let response;
    try {
      response = await fetch(this.settings.imageApi, {
        method: "POST",
        headers:
          this.settings.imageApiAuth == ""
            ? new Headers()
            : new Headers({ Authorization: this.settings.imageApiAuth }),
        body: requestData,
      });
      // business logic goes here
    } catch (error) {
      new Notice(t("Image Upload API error") + ": " + error.toString());
      return error;
    }

    if (!response.ok) {
      await handleApiResponseServerError(response);
    }
    return await handleApiResponse(response, this.settings);
  }

  async uploadFile(image: File): Promise<any> {
    let requestData = new FormData();
    requestData.append("imagefile", image);

    let response;
    try {
      response = await fetch(this.settings.imageApi, {
        method: "POST",
        headers:
          this.settings.imageApiAuth == ""
            ? new Headers()
            : new Headers({ Authorization: this.settings.imageApiAuth }),
        body: requestData,
      });
      // business logic goes here
    } catch (error) {
      new Notice(t("Image Upload API error") + ": " + error.toString());
      return error;
    }

    if (!response.ok) {
      await handleApiResponseServerError(response);
    }
    return await handleApiResponse(response, this.settings);
  }
}
