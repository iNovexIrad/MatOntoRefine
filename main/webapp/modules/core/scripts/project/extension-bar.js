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
				"label": "RDF Skeleton",
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
								var skelIndex = document.getElementById('skelSelect').selectedIndex;
								
								skelUrl = skels[skelIndex].url;
							
								
								$.ajax({
									type: "GET",
									url:'http://10.10.1.187:8080/MatRest/Skeleton/load?url=' + skelUrl,
									crossDomain: true,
									async: false
									
								}).done(function(msg){
									json = msg.skeleton_body;
											
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
									
								}).fail(function(){
									alert("Gathering selected skeleton failed");
								}).always(function(){
									DialogSystem.dismissUntil(0);
								});
								
								
								/*
								var json;
								rawFile.onreadystatechange = function ()
								{
									alert(rawFile.readyState);
									if(rawFile.readyState === 4)
									{
										alert(rawFile.status);
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
									
								/* 
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
									
								} */
								
							}
							var frame = DialogSystem.createDialog();
							
							frame.width("600px");
							
							var skelListFile = new XMLHttpRequest();
							
							
							var loadingFrame = DialogSystem.createDialog();
							var header = $('<div></div>').addClass("dialog-header").text("Publishing").appendTo(loadingFrame);
							var body = $('<div><img src="images/small-spinner.gif">Sending Request, Please Wait...</div>').addClass("loading-body").appendTo(loadingFrame);
							loadingFrame.width("400px");
							DialogSystem.showDialog(loadingFrame);
							
							skelListFile.open("GET", "http://10.10.1.187:8080/MatRest/Skeleton/list", false);
							
							var skels;
							var skelListJson;
							$.ajax({
								type: "GET",
								url:"http://10.10.1.187:8080/MatRest/Skeleton/list",
								dataType:'json',
								crossDomain: true,
								async: false,
								
							}).done(function(msg){
								skels = msg.skeletons;
								console.log(skels);
							})
							
							/* skelListFile.onreadystatechange = function (){
								if(rawFile.readyState === 4)
								{
									//alert(rawFile.status);
									if(rawFile.status === 200 || rawFile.status == 0)
									{
										DialogSystem.dismissUntil(0);
										skelListJson = rawFile.responseText;
										console.log(skelListJson);
										
									}
								}
							} */
							//console.log(skelListJson.skeletons);
							
							var header = $('<div></div>').addClass("dialog-header").text("Publish Data").appendTo(frame);
							var body = $('<div>Please choose an RDF Skeleton to apply:</div>').addClass("dialog-body").appendTo(frame);
							
							//Attempt to list skeletons from MatRest
							try{
								
								//var skels = skelListJson.skeletons;
								var select = $('<select id="skelSelect"></select>').addClass("skelSelect").appendTo(body);
								skels.forEach(function(skel){
									console.log(skel);
									var skelOption = $('<option value ="' + skel.name + '">'+skel.name+'</option>').appendTo(select);
								});
							
							}catch(e){
								alert("Could not load skeletons");
								
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
							}
							
							
							
							
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
					},
					{
						id:"pubSkel",
						label:"Publish Skeleton",
						click:function(){
							HistoryPanel.prototype._extractOperations();
						}
						
					}
					
				]
			}

];


HistoryPanel.prototype._extractOperations = function() {
  var self = this;
  $.getJSON(
      "command/core/get-operations?" + $.param({ project: theProject.id }), 
      null,
      function(data) {
        if ("entries" in data) {
          HistoryPanel.prototype._showExtractOperationsDialog(data);
        }
      },
      "jsonp"
  );
};

HistoryPanel.prototype._showExtractOperationsDialog = function(json) {
  var self = this;
  var frame = $(DOM.loadHTML("core", "scripts/project/history-extract-dialog.html"));
  var elmts = DOM.bind(frame);

  elmts.dialogHeader.html($.i18n._('core-project')["extract-history"]);
  elmts.or_proj_extractSave.html($.i18n._('core-project')["extract-save"]);
  elmts.selectAllButton.html($.i18n._('core-buttons')["select-all"]);
  elmts.unselectAllButton.html($.i18n._('core-buttons')["unselect-all"]);
  elmts.closeButton.html($.i18n._('core-buttons')["close"]);
  elmts.exportButton.html("Publish Skeleton");
  elmts.api_key.val("5662a180-bff3-4d3e-974d-8ffdc4a1d7ac");
  
  var entryTable = elmts.entryTable[0];
  var createEntry = function(entry) {
    var tr = entryTable.insertRow(entryTable.rows.length);
    var td0 = tr.insertCell(0);
    var td1 = tr.insertCell(1);
    td0.width = "1%";

    if ("operation" in entry) {
      entry.selected = true;

      $('<input type="checkbox" checked="true" />').appendTo(td0).click(function() {
        entry.selected = !entry.selected;
        updateJson();
      });

      $('<span>').text(entry.operation.description).appendTo(td1);
    } else {
      $('<span>').text(entry.description).css("color", "#888").appendTo(td1);
    }
  };
  for (var i = 0; i < json.entries.length; i++) {
    createEntry(json.entries[i]);
  }

  var updateJson = function() {
    var a = [];
    for (var i = 0; i < json.entries.length; i++) {
      var entry = json.entries[i];
      if ("operation" in entry && entry.selected) {
        a.push(entry.operation);
      }
    }
    elmts.textarea.text(JSON.stringify(a, null, 2));
  };
  updateJson();
  
  elmts.closeButton.click(function() { DialogSystem.dismissUntil(level - 1); });
  elmts.exportButton.click(function() {
	var myJson = elmts.textarea.text();
	//*********************************************
	//    POST REQUEST FOR PUBLISHING SKELETON
	//
	//
	//*********************************************
	console.log(myJson);
	//alert(theProject.metadata.name);
	apiKey = document.getElementById("api_key").value;
	$.ajax({
		type: "POST",
		url: "http://10.10.1.187:8080/MatRest/Publish/refine_skeleton?DataName=" + theProject.metadata.name + "&CkanApi=5662a180-bff3-4d3e-974d-8ffdc4a1d7ac",
		dataType: 'json',
		data: myJson,
		contentType : 'text/plain',
		processData: false,
		crossDomain: true,
		async:false
		
	}).done(function(msg){
		alert("Publish Successful");
		console.log(msg);
		DialogSystem.dismissUntil(0);
	}).error(function(msg){
		alert(msg.responseText);
		console.log(msg);
		DialogSystem.dismissUntil(0);
	}); 
	
  });
  
  elmts.selectAllButton.click(function() {
    for (var i = 0; i < json.entries.length; i++) {
      json.entries[i].selected = true;
    }

    frame.find("about:blank", 'input[type="checkbox"]').attr("checked", "true");
    updateJson();
  });
  elmts.unselectAllButton.click(function() {
    for (var i = 0; i < json.entries.length; i++) {
      json.entries[i].selected = false;
    }

    frame.find('input[type="checkbox"]').removeAttr("checked");
    updateJson();
  });

  var level = DialogSystem.showDialog(frame);

  elmts.textarea[0].select();
};

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
