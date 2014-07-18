/*

Copyright 2010, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

 * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
 * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,           
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY           
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 */

function ExtensionBar(div) {
  this._div = div;
  this._initializeUI();
}

ExtensionBar.MenuItems = [
			
			{
				"id":"matProjSkeleton",
				"label": "Apply RDF Skeleton",
				"submenu" : [
					{
						"id": "matProj/apply-rdf-schema",
						label: "Apply new Skeleton",
						click: function() {
							var fixJson = function(json) {
								json = json.trim();
								if (!json.startsWith("[")) {
									json = "[" + json;
								}
								if (!json.endsWith("]")) {
									json = json + "]";
								}

								return json.replace(/\}\s*\,\s*\]/g, "} ]").replace(/\}\s*\{/g, "}, {");
							};
							
							function readTextFile()
							{
								//var json;
								if(document.getElementById('uploadRadio').checked == false){
									var rawFile = new XMLHttpRequest();
									if(document.getElementById('matRadio').checked == true){
										rawFile.open("GET", "scripts/project/MaterialsProjectRDFjson.html", false);
									}else if(document.getElementById('scdRadio').checked == true){
										rawFile.open("GET", "scripts/project/SCDRDFjson.html", false);
									}
									var json;
									rawFile.onreadystatechange = function ()
									{
										//alert(rawFile.readyState);
										if(rawFile.readyState === 4)
										{
											//alert(rawFile.status);
											if(rawFile.status === 200 || rawFile.status == 0)
											{
												json = rawFile.responseText;
												
												try {
													//alert(json);
													//json = fixJson(json);
													json = JSON.parse(json);
													
												}
												catch (e) {
													//alert(json);
													return;
												}
												Refine.postCoreProcess(
													"apply-operations",
													{},
													{ operations: JSON.stringify(json) },
													{ everythingChanged: true },
													{
														onDone: function(o) {
															if (o.code == "pending") {
																// Something might have already been done and so it's good to update
																//Refine.update({ everythingChanged: true });
															}
														}
													}
												);
												
											}
										}
									}
									DialogSystem.dismissUntil(0);
									rawFile.send(null);
									
								}
								else{
									var skelUpld = document.getElementById("fileUploadForm");
									if(skelUpld.files.length == 0){
										alert("Please add a file");
									}else{
										var textFile = skelUpld.files[0];
										
										try{
											var reader = new FileReader();
											reader.readAsText(textFile);
											$(reader).on('load', processFile);
											function processFile(e){
												var fileText = e.target.result, results;
												
												var json;
												try{
													console.log(fileText);
													json = JSON.parse(fileText);
													//alert("parsed");
													Refine.postCoreProcess(
														"apply-operations",
														{},
														{ operations: JSON.stringify(json) },
														{ everythingChanged: true },
														{
															onDone: function(o) {
																if (o.code == "pending") {
																	// Something might have already been done and so it's good to update
																	//Refine.update({ everythingChanged: true });
																}
															}
														}
													);
												}catch (e){
													console.log(e);
												}
											}
											DialogSystem.dismissUntil(0);
										}catch(e){
											alert("Error reading file.");
										}
									}
									
								}
								
							}
							var frame = DialogSystem.createDialog();
							
							frame.width("600px");
							
							var header = $('<div></div>').addClass("dialog-header").text("Publish Data").appendTo(frame);
							var body = $('<div>Please choose an RDF Skeleton to apply:</div>').addClass("dialog-body").appendTo(frame);
							var form = $('<form id="skeletonSelect"></form>').appendTo(body);
							var option1 = $('<input type="radio" name="skeleton" id="matRadio" value="matProj" checked>Materials Project<br>').click(function(){
									document.getElementById('fileUploadForm').disabled = true;
				
								}).appendTo(form);
							var option2 = $('<input type="radio" name="skeleton" id="scdRadio" value="scd">SCD<br>').click(function(){
									document.getElementById('fileUploadForm').disabled = true;
									
								}).appendTo(form);
							var optionUpload= $('<input type="radio" name="skeleton" id="uploadRadio" value="upload">Upload<br>').click(function(){
									document.getElementById('fileUploadForm').disabled = false;
									
								}).appendTo(form);
							var upload = $('<input type="file" id="fileUploadForm" name="fileUpload" disabled></input>').appendTo(form);
							
							
							var footer = $('<div></div>').addClass("dialog-footer").appendTo(frame);
							$('<button></button>').addClass('button').text("Cancel").click(function() {
								DialogSystem.dismissUntil(0);
								}).appendTo(footer);
								
							$('<button id="applySkel"></button>').addClass('button').text("Apply").click(function(){
									readTextFile();
									
								}).appendTo(footer);
								
								
							DialogSystem.showDialog(frame);
							document.getElementById('fileUploadForm').disabled = true;
							//document.getElementById('uploadRadio').disabled = true;
							var json;
							//json = readTextFile();
							
							
						}
					}
					
				]
			}
];

ExtensionBar.addExtensionMenu = function(what) {
  MenuSystem.appendTo(ExtensionBar.MenuItems, [], what);
};

ExtensionBar.appendTo = function(path, what) {
  MenuSystem.appendTo(ExtensionBar.MenuItems, path, what);
};

ExtensionBar.insertBefore = function(path, what) {
  MenuSystem.insertBefore(ExtensionBar.MenuItems, path, what);
};

ExtensionBar.insertAfter = function(path, what) {
  MenuSystem.insertAfter(ExtensionBar.MenuItems, path, what);
};

ExtensionBar.prototype.resize = function() {
};

ExtensionBar.prototype._initializeUI = function() {
  var elmts = DOM.bind(this._div);
  for (var i = 0; i < ExtensionBar.MenuItems.length; i++) {
    var menuItem = ExtensionBar.MenuItems[i];
    var menuButton = this._createMenuButton(menuItem.label, menuItem.submenu);
    elmts.menuContainer.append(menuButton);
  }
};

ExtensionBar.prototype._createMenuButton = function(label, submenu) {
  var self = this;

  var menuItem = $("<a>").addClass("button").append('<span class="button-menu">' + label + '</span>');

  menuItem.click(function(evt) {
    MenuSystem.createAndShowStandardMenu(
        submenu,
        this,
        { horizontal: false }
    );

    evt.preventDefault();
    return false;
  });

  return menuItem;
};

ExtensionBar.handlers = {};
