import { App, PluginSettingTab, Setting } from "obsidian";
import autoImageRemoteUploaderPlugin from "./main";
import { t } from "./lang/helpers";
import { getOS } from "./utils";

export interface PluginSettings {
  uploadByClipSwitch: boolean;
  imageApi: string;
  imageApiAuth: string;
  imageSizeSuffix: string;
  workOnNetWork: boolean;
  newWorkBlackDomains: string;
  fixPath: boolean;
  applyImage: boolean;
  deleteSource: boolean;
  imageDesc: "origin" | "none" | "removeDefault";
  [propName: string]: any;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  uploadByClipSwitch: true,
  imageApi: "http://127.0.0.1:36677/upload",
  imageApiAuth: "",
  imageSizeSuffix: "",
  workOnNetWork: false,
  fixPath: false,
  applyImage: true,
  newWorkBlackDomains: "",
  deleteSource: false,
  imageDesc: "origin",
};

export class SettingTab extends PluginSettingTab {
  plugin: autoImageRemoteUploaderPlugin;

  constructor(app: App, plugin: autoImageRemoteUploaderPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    const os = getOS();

    containerEl.empty();
    containerEl.createEl("h2", {
      text: t("Obsidian Auto Image Remote Uploader Plugin Settings"),
    });

    new Setting(containerEl)
      .setName(t("Auto pasted upload"))
      .setDesc(
        t(
          "If you set this value true, when you paste image, it will be auto uploaded(you should set the picGo server rightly)"
        )
      )
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.uploadByClipSwitch)
          .onChange(async value => {
            this.plugin.settings.uploadByClipSwitch = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("image upload API"))
      .setDesc(t("image upload API desc"))
      .addText(text =>
        text
          .setPlaceholder(t("Please input uploader api"))
          .setValue(this.plugin.settings.imageApi)
          .onChange(async key => {
            this.plugin.settings.imageApi = key;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("image upload API Authtoken"))
      .setDesc(t("image upload API Authtoken Desc"))
      .addText(text =>
        text
          .setPlaceholder(t("Please input upload api authtoken"))
          .setValue(this.plugin.settings.imageApiAuth)
          .onChange(async key => {
            this.plugin.settings.imageApiAuth = key;
            await this.plugin.saveSettings();
          })
      );

    // image desc setting
    new Setting(containerEl)
      .setName(t("Image desc"))
      .setDesc(t("Image desc"))
      .addDropdown(cb =>
        cb
          .addOption("origin", t("reserve")) // 保留全部
          .addOption("none", t("remove all")) // 移除全部
          .addOption("removeDefault", t("remove default")) // 只移除默认即 image.png
          .setValue(this.plugin.settings.imageDesc)
          .onChange(async (value: "origin" | "none" | "removeDefault") => {
            this.plugin.settings.imageDesc = value;
            this.display();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("Image size suffix"))
      .setDesc(t("Image size suffix Description"))
      .addText(text =>
        text
          .setPlaceholder(t("Please input image size suffix"))
          .setValue(this.plugin.settings.imageSizeSuffix)
          .onChange(async key => {
            this.plugin.settings.imageSizeSuffix = key;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("Work on network"))
      .setDesc(t("Work on network Description"))
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.workOnNetWork)
          .onChange(async value => {
            this.plugin.settings.workOnNetWork = value;
            this.display();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("Network Domain Black List"))
      .setDesc(t("Network Domain Black List Description"))
      .addTextArea(textArea =>
        textArea
          .setValue(this.plugin.settings.newWorkBlackDomains)
          .onChange(async value => {
            this.plugin.settings.newWorkBlackDomains = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("Upload when clipboard has image and text together"))
      .setDesc(
        t(
          "When you copy, some application like Excel will image and text to clipboard, you can upload or not."
        )
      )
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.applyImage)
          .onChange(async value => {
            this.plugin.settings.applyImage = value;
            this.display();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t("Delete source file after you upload file"))
      .setDesc(t("Delete source file in ob assets after you upload file."))
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.deleteSource)
          .onChange(async value => {
            this.plugin.settings.deleteSource = value;
            this.display();
            await this.plugin.saveSettings();
          })
      );
  }
}
