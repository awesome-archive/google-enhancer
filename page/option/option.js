/*
* refer to v2ex-plus
* @author sciooga
* @link: https://github.com/sciooga/v2ex-plus
* and made some changes
*/

"use strict";

function saveChoice (e) {
	let name = e.target.name;
	let checked = e.target.checked;
	let value = checked ? 1 : 0;
	setItemByKey(name, value);
}

function setItem (obj) {
	chrome.storage.sync.set(obj);
	chrome.storage.local.set(obj);
}

function setItemByKey (key, value) {
	let obj = {};
	obj[key] = value;
	chrome.storage.sync.set(obj);
	chrome.storage.local.set(obj);
}

function getItem (obj, callback) {
	chrome.storage.sync.get(obj, callback);
}

/*
    * Use arrow keys to flip pages : default true
    * Double click back to top : default true
    * Open link in new tab : default true
    * Search form pinned: default false
    * Endless Google: default false
    * Site search on context menu : default false
    * Filetype search on context menu: default false
    * Time range search on context menu: default false
    * Night mode: default false
    * Card style UI: default false
*/
const defaultSettings = {
	"flipPage": 1,
	"dblclickToTop": 1,
	"newTab": 1,
	"siteSearch": 0,
	"kwColor": "#dd4b39",
	"kwBgColor": "#ffffff",
	"kwOpacity": 0.4,
	"filetypeSearch": 0,
	"timeRangeSearch": 0,
	"nightMode": 0,
	"cardStyle": 0,
	"sformPinned": 0,
	"endless": 0
};

window.onload = function () {
	const settingButtons = {
		flipPage: document.querySelector(".flipPage"),
		dblclickToTop: document.querySelector(".dblclickToTop"),
		newTab: document.querySelector(".newTab"),
		siteSearch: document.querySelector(".siteSearch"),
		kwColor: document.querySelector(".kwColor"),
		kwBgColor: document.querySelector(".kwBgColor"),
		kwOpacity: document.querySelector(".kwOpacity"),
		kwOpacityValue: document.getElementById("kwOpacityValue"),
		filetypeSearch: document.querySelector(".filetypeSearch"),
		timeRangeSearch: document.querySelector(".timeRangeSearch"),
		nightMode: document.querySelector(".nightMode"),
		cardStyle: document.querySelector(".cardStyle"),
		sformPinned: document.querySelector(".sformPinned"),
		endless: document.querySelector(".endless")
	};

	function resetAll () {
		setItem(defaultSettings);
		location.reload();
	}

	// Show saved settings
	function restoreSetting () {
		getItem(defaultSettings, (settings) => {
			for (let name in settings) {
				let value = settings[name];
				let button = settingButtons[name];
				let checked = true;
				switch (name) {
					case "kwColor":
					case "kwBgColor": {
						button.value = value;
						setItemByKey(name, value);
						button.onchange = function (e) {
							let hex = this.value.toLowerCase();
							setItemByKey(name, hex);
						};
						button.disabled = false;
						break;
					}
					case "kwOpacity": {
						button.value = value;
						settingButtons["kwOpacityValue"].textContent = value;
						setItemByKey(name, value);
						button.onchange = function () {
							settingButtons["kwOpacityValue"].textContent = this.value;
							setItemByKey(name, this.value);
						};
						button.disabled = false;
						break;
					}
					default: {
						checked = !!parseInt(value);
						setItemByKey(name, parseInt(value));
						button.checked = checked;
						button.onchange = saveChoice;
						button.disabled = false;
					}

				}
			}
		});
	}
	
	function i18n () {
		let objects = document.getElementsByTagName('*');
		for(let i = 0; i < objects.length; i++) {
			if (objects[i].dataset && objects[i].dataset.message) {
				objects[i].childNodes[0].textContent = chrome.i18n.getMessage(objects[i].dataset.message);
			}
		}
	}

	document.getElementById("allDefault").onclick = resetAll;
	i18n();
	restoreSetting();
};
