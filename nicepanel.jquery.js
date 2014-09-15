//! version : 1.0.0
//! authors : Christopher Phelefu
//! license : MIT
//! nicepanel.jquery.com

/*! jQuery UI - v1.11.0 - 2014-08-07
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, draggable.js, droppable.js, resizable.js, selectable.js, sortable.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */


(function ($) {
    var defaults = {
        enterAnimation: "bounceIn",
        exitAnimation: "bounceOut",
        addAnimation: "wobble", //animation to perforn when adding a panel and another one already exists
        content: "<h3>asdsad</h3>Missing content",
        cssClass: "",
        style: "general",
        position: "top-right",
        draggable: false,
        modal: false,
        resizable: false,
        height: null,
        uid: null,
        top: "70px",
        bottom: "70px",
        right: "70px",
        left: "70px",
        width: null,
        faicon: null,
        duration: null,
        title: null,
        parent: "body", //parent element/div to append the panel to
        addMethod: "prepend", //
        close: true,
        onclick: function () { }
    },
    _getRandomString = function () {
        var max = 25, min = 5,
            length = Math.floor(Math.random() * (max - min + 1)) + min,
            text = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    _applySettings = function (settings, container) {
        
        if (typeof container.attr("id") === 'undefined') {
            while (settings.uid == null || $("#" + settings.uid).length > 0) {
                settings.uid = _getRandomString();
            }
            container.attr("id", settings.uid);
        }

        if (settings.enterAnimation) {
            container.attr("data-enter-animation", settings.enterAnimation);
            container.addClass(settings.enterAnimation + " animated");
            setTimeout(function () { container.removeClass(settings.enterAnimation + " animated"); }, 1000);
        }
        if (settings.exitAnimation) {
            container.attr("data-exit-animation", settings.exitAnimation);
        }

        if (settings.style) {
            container.addClass("nicepanel-style " + settings.style);
        }
        if (settings.cssClass) {
            container.addClass(settings.cssClass);
        }
        if (settings.draggable) {
            container.draggable({ scroll: false });//.css({ "position": "absolute" });
        }
        if (settings.resizable) {
            container.resizable({ animated: true });
        }
        if (settings.duration) {
            setTimeout(function () { $.nicepanel.close(settings.uid); }, settings.duration);
        }
        if (settings.onclick) {
            container.click(settings.onclick);
        }
        if (settings.width) {
            container.css("width", settings.width);
        }
        
        container.data("nicepanel-settings", settings);

        //adding events
        container.showPanel = _showPanel;
        
        return container;
    },
    _buildPanelContent = function (settings) {
        var container = $("<div/>").addClass("nicepanel");
        //adding content
        var cnt = $("<div/>").css("display", "block");
        if (settings.faicon) {
            cnt.append($("<div/>").css({ "display": "inline-block", "padding": "5px", "font-size": "30px" }).html('<i class="fa ' + settings.faicon + '"></i>'));
        }
        cnt.append($("<div/>").css("display", "inline-block").append(settings.title ? $("<h3/>").html(settings.title) : "").append(settings.content));
        container.append(cnt);
        container.data("isnicegenerated", true);
        return container;
    },
    _showPanel = function () {
        //adding to parent container or not
        var container = $(this),
            settings = $(this).data("nicepanel-settings"),
            elems = $(".nicepanel-container." + settings.position);
        if (elems.length == 0) {
            container = $("<div/>").addClass("nicepanel-container").append(container);
            container.addClass(settings.position);
            container.data("nicepanel-settings", settings);
            if (settings.addMethod == "prepend") {
                $(settings.parent).prepend(container);
            } else {
                $(settings.parent).append(container);
            }
        } else {
            container.css("margin-top", "10px");
            $(".nicepanel-container." + settings.position).append(container);
        }
    };

    $.nicepanel = function (elems, options) { }

    $.nicepanel.apply = function (elems, options) {
        //default
        var settings = $.extend({}, defaults, options);
        elems.each(function () {
            var t = _applySettings(settings, $(this));
            t.showPanel();
        });
    }

    $.nicepanel.get = function (options) {
        var container = _buildPanel(options);
        return container;
    }
       
    $.nicepanel.show = function (options) {
        var settings = $.extend({}, defaults, options),
            container = _buildPanelContent(settings);
        container = _applySettings(settings, container);
        container.showPanel();
        return container;
    }

    $.nicepanel.closeAll = function () {
        var elems = $(".nicepanel");
        $.each(elems, function (i, elem) {
            exitAnim = elem.attr("data-enter-animation");
            elem.removeClass(elem.attr("data-enter-animation") + " animated");
            elem.addClass(elem.attr("data-exit-animation") + " animated");
            setTimeout(function () { elem.remove(); }, 1000);
        });
    }

    $.nicepanel.animate = function (uid){
        $("div#" + uid).addClass("wobble animated");
        setTimeout(function () {
            $("div#" + uid).removeClass("wobble animated");
        }, 1000);
    }

    $.nicepanel.alert= function (content, title, settings) {
        $.nicepanel.show({
            duration: 5000,
            title: title ? title : "Alert",
            content: content,
            style: "general alert",
            faicon: "fa-times-circle"
        });
    }

    $.nicepanel.warning = function (content, title, settings) {
        $.nicepanel.show({
            duration: 5000,
            title: title ? title : "Warning",
            content: content,
            style: "general warning",
            faicon: "fa-warning"
        });
    }

    $.nicepanel.info = function (content, title, settings) {
        $.nicepanel.show({
            duration: 5000,
            title: title ? title : "Info",
            content: content,
            style: "general info",
            faicon: "fa-info-circle"
        });
    }

    $.nicepanel.success = function (content, title, settings) {
        $.nicepanel.show({
            duration: 5000,
            title: title ? title : "Success!",
            content: content,
            style: "general info",
            faicon: "fa-heart"
        });
    }

    $.nicepanel.close = function (uid) {
        var elem = $("#" + uid + ".nicepanel"),
            exitAnim = elem.attr("data-enter-animation");
        elem.addClass(elem.attr("data-exit-animation") + " animated");
        setTimeout(function () { elem.remove(); }, 1000);
    }

}(jQuery));
