$(document).ready(function() {
	// localStorage.removeItem("zones-for-group");
	// localStorage.removeItem("curr-group-name");
	// window.onbeforeunload = function() {
	// 	localStorage.removeItem("zones-for-group");
	// 	if (localStorage.getItem("zones-for-group") == null) {
	// 		return "Your work will be lost";
	// 	}
	// };
	M.AutoInit();
	var zoneSel = 0;
	var zoneArr = [];
	var usedZones = [];
	var allZones = [];

	// https://stackoverflow.com/posts/1129270
	function mySort(a, b) {	
		if (a.id < b.id) { return -1; }
		if (a.id > b.id) { return 1; }
		return 0;
	}

	function isChecked(s) { if (s) { return " checked"; } else { return ""; }}

	var colors = ["#018ae0", "#fdb515", "#b39ddb", "#fccde5", "#b2df8a", "#ff8a65"];

	var nuevo = true
	if (nuevo && localStorage.getItem("mode-settings") == null) {
		var d = {modes: [{id: 0, name: "Closed", heating: "55", cooling: "85", enabled: true}, {id: 1, name: "Open", heating: "70", cooling: "75", enabled: false}, {id: 2, name: "Do Not Exceed", heating: "52", cooling: "83", enabled: true}, {id: 3, name: "Other", heating: "51", cooling: "84", enabled: true}, {id: 4, name: "Midnight", heating: "54", cooling: "88", enabled: false}, {id: 5, name: "Early Morn", heating: "50", cooling: "80", enabled: true}]};
		localStorage.setItem("mode-settings", JSON.stringify(d));
		nuevo = false;
	}

	function getModes() {
		$.ajax({
			"url": "http://127.0.0.1:5000/get_modes",
			"type": "GET",
			"dataType": "json",
			"success": function(d) {
				console.log("hi");
			},
			"error": function(d) {
				d = JSON.parse(localStorage.getItem("mode-settings"));
				var sorted = d["modes"].sort(mySort);
				var obj = new Object();
				obj.modes = sorted;
				localStorage.setItem("mode-settings", JSON.stringify(obj));
				var modeDiv = $("#mode-div");
				var count = 0;
				for (var i in sorted) {
					var curr = sorted[i];
					modeDiv.append("<div class='col s2 z-depth-1 mode-card' style='background-color: " + colors[count] + ";'><input id='mode" + count + "' type='text' maxlength='10' value='" + curr["name"] + "' class='my-input mode-title'/><div class='setpnt-div' style='padding-top: 8px;'><input class='red lighten-2 spl rtab' maxlength='2' value=" + curr["heating"] + " type='number' max='72' min='35' /><input class='blue lighten-2 spr rtab' maxlength='2' value=" + curr["cooling"] + " type='number' max='90' min='74'/></div><div class='switch'><label><span class='swi-text'>off</span><input class='ogswitch' type='checkbox'" + isChecked(curr["enabled"]) + "><span class='lever'></span><span class='swi-text'>on</span></label></div></div>");
					if (count != 5) { modeDiv.append("<div class='col sml'></div>"); }
					count += 1;
				}
			}
		});
	} getModes();

	var groupNames = [];

	function getGroupings() {
		$.ajax({
			"url": "http://127.0.0.1:5000/get_groups",
			"type": "GET",
			"dataType": "json",
			"success": function(d) {
				console.log("hi");
			},
			"error": function(d) {
				var groupings = $("#groupings-row");
				d = {groupings:[{group: "Basketball Courts 1", zones: ["North 1", "South 1", "East 1", "West 1"],settings:{fri: [2, 1, 0], mon: [2, 1, 0], sat: [4, 3, 2], sun: [0, 2, 1], thu: [1, 3, 4], tue: [4, 3, 4], wed: [1, 0, 2]},times: {fri: ["8.00", "18.00"], mon: ["2.00", "17.00"], sat: ["3.00", "16.00"], sun: ["4.00", "15.00"], thu: ["5.00", "14.00"], tue: ["6.00", "13.00"], wed: ["7.00", "12.00"]}},{group: "Basketball Courts 2", zones: ["North 2", "South 2", "East 2", "West 2"],settings:{sun: [2, 1, 0], mon: [2, 1, 0], thu: [4, 3, 2], fri: [0, 2, 1], sat: [1, 3, 4], wed: [4, 3, 4], tue: [1, 0, 2]},times: {fri: ["8.00", "18.00"], mon: ["2.00", "17.00"], sat: ["3.00", "16.00"], sun: ["4.00", "15.00"], thu: ["5.00", "14.00"], tue: ["6.00", "13.00"], wed: ["7.00", "12.00"]}},{group: "Basketball Courts 3", zones: ["North 3", "South 3", "East 3", "West 3"],settings:{mon: [2, 1, 0], fri: [2, 1, 0], sat: [4, 3, 2], thu: [0, 2, 1], sun: [1, 3, 4], tue: [4, 3, 4], wed: [1, 0, 2]},times: {fri: ["8.00", "18.00"], mon: ["2.00", "17.00"], sat: ["3.00", "16.00"], sun: ["4.00", "15.00"], thu: ["5.00", "14.00"], tue: ["6.00", "13.00"], wed: ["7.00", "12.00"]}},{group: "Basketball Courts 4", zones: ["North 4", "South 4", "East 4", "West 4"],settings:{fri: [2, 1, 0], sat: [2, 1, 0], mon: [4, 3, 2], sun: [0, 2, 1], tue: [1, 3, 4], thu: [4, 3, 4], wed: [1, 0, 2]},times: {fri: ["8.00", "18.00"], mon: ["2.00", "17.00"], sat: ["3.00", "16.00"], sun: ["4.00", "15.00"], thu: ["5.00", "14.00"], tue: ["6.00", "13.00"], wed: ["7.00", "12.00"]}}]};
				var groups = d["groupings"];
				if (groups.length != 0) { groupings.html(""); }
				for (var i in groups) {
					var curr = groups[i];
					var name = curr["group"];
					groupNames.push(name);
					localStorage.setItem(name + "-group", JSON.stringify(curr));
					var g = $("<div class='col s3-3 group-card'><div class='card hoverable'><div class='card-content'><!-- <p>Current Heating Setpoint: 65<br>Current Cooling Setpoint: 78<br>Current State: On</p> --><span class='card-title' style='margin-bottom: 0; margin-top: 24px;'>" + name + "</span></div><div class='card-action'><a class='ca-modes' href='#'>Modes</a><a class='ca-zones' href='#'>Zones</a><a class='ca-delete' href='#'>Delete</a></div></div></div>");
					groupings.append(g);
					$.merge(usedZones, curr["zones"]);
				}
				$(".ca-modes").each(function(i) {
					var name = groupNames[i];
					$(this).click(function() {
						localStorage.setItem("curr-group-name", name);
						localStorage.removeItem("zones-for-group");
						window.location.href = "schedule-epochs.html";
					});
				});
				$(".ca-zones").each(function() {
					$(this).click(function() {
						console.log($(this));
					});
				});
				$(".ca-delete").each(function() {
					$(this).click(function() {
						console.log($(this));
					});
				});
				setCB();
			}
		});
	} getGroupings();

	function setGB() { $("#group-btn").html("Group Selected (" + zoneSel + ")"); }

	function setCB() {
		$.ajax({
			"url": "http://127.0.0.1:5000/get_zones",
			"type": "GET",
			"dataType": "json",
			"success": function(d) {
				console.log("hi");
			},
			"error": function(d) {
				// console.log(usedZones);
				d = {zones: ["North 1", "South 1", "East 1", "West 1", "North 2", "South 2", "East 2", "West 2 Basketball", "North 3 Basketball", "South 3 Basketball", "East 3 Basketball", "West 3 Basketball", "North 4 Basketball", "South 4 Basketball", "East 4 Basketball", "West 4 Basketball", "North 5 Basketball", "North 6 Basketball", "South 5 Basketball", "South 6", "East 5", "East 6", "West 5", "West 6"]};
				var zones = d["zones"];
				var zcb = $("#zone-cb");
				for (var i in zones) {
					var curr = zones[i];
					allZones.push(curr);
					var s = "'";
					var c = "";
					if ($.inArray(curr, usedZones) != -1) {
						s += " checked disabled";
						c += "class='grey-text text-darken-1'";
					}
					var cb = $("<div class='cb-col'><label><input type='checkbox' class='filled-in" + s + " /><span " + c + ">" + curr + "</span></label></div>");
					zcb.append(cb);
				}
				cbClicks();
			}
		});
	}

	function cbClicks() {
		$(".filled-in").each(function() {
			var t = $(this).next().html();
			$(this).click(function() {
				if ($(this).prop("checked")) {
					zoneSel += 1;
					zoneArr.push(t);
				} else {
					zoneSel -= 1;
					zoneArr.splice($.inArray(t, zoneArr), 1);
				}
				setGB();
			});
		});
	}

	$("#group-btn").click(function() {
		if (zoneSel == 0) {
			$("#modal-continue").addClass("disabled");
			$("#modal-header").html("Select at least one zone to form a group");
			$("#modal-text").html("");
		} else {
			$("#modal-continue").removeClass("disabled");
			var s = "Form a group with the following ";
			if (zoneSel == 1) { s += "zone:"; } else { s += zoneSel + " zones:"; }
			$("#modal-header").html(s);
			$("#modal-text").html(zoneArr.join("<br>"));
		}
	});

	$("#modal-continue").click(function() {
		localStorage.setItem("zones-for-group", JSON.stringify(zoneArr));
		localStorage.removeItem("curr-group-name");
		window.location.href = "schedule-epochs.html";
	});

	$("#save-modes").click(function() {
		$.ajax({
			"url": "http://127.0.0.1:5000/save_mode",
			"type": "GET",
			"dataType": "json",
			"success": function(d) {
				console.log("hi");
			},
			"error": function(d) {
				var obj = new Object();
				obj.modes = [];
				$(".mode-card").each(function(i) {
					var m = new Object();
					m.id = i;
					var inputs = $(this).find("input");
					m.name = inputs[0].value;
					m.heating = inputs[1].value;
					m.cooling = inputs[2].value;
					m.enabled = $(inputs[3]).prop("checked");
					obj.modes.push(m);
				});
				M.toast({html: 'Current modes successfully updated.', classes:"rounded", displayLength: 2000});
				console.log(obj);
				localStorage.setItem("mode-settings", JSON.stringify(obj));
			}	
		});
	});
});
