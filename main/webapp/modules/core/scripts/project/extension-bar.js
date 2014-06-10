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
				"label": "Materials Project",
				"submenu" : [
					{
						"id": "matProj/apply-rdf-schema",
						label: "Apply Materials Project RDF Skeleton",
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
								var rawFile = new XMLHttpRequest();
								rawFile.open("GET", "scripts/project/MaterialsProjectRDFjson.html", false);
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
								rawFile.send(null);
								
								
							}
							var json;
							json = readTextFile();
							
							
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
