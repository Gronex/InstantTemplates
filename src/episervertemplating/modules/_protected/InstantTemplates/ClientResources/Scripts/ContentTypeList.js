﻿define([
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/dom-class",

    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/when",
    "dojo/topic",

// dijit
    "dijit/layout/_LayoutWidget",
// epi
    "epi/dependency",
    "epi/shell/TypeDescriptorManager",
    "./ContentTypeGroup"
],

function (
// dojo
    array,
    declare,
    lang,

    domClass,

    Deferred,
    all,
    when,
    topic,
// dijit
    _LayoutWidget,
// epi
    dependency,
    TypeDescriptorManager,
    ContentTypeGroup
) {

    return declare([_LayoutWidget], {
        // summary:
        //      A list of suggested and available content types for content creation.
        // description:
        //      Displays a list of suggested and available content types for content creation.
        // tags:
        //      internal

        // parentLink: [public] String
        //      Link to parent content which the new content will be created beneath.
        parentLink: null,

        // contentLink: [public] String
        //     The contentlink for which the list will be filtered on.
        contentLink: null,
        templatesRoot: null,
        constructor: function(){
            var vm = this;
            topic.subscribe("/epi/shell/action/changeview", function (name, args) {
                if (name !== "instantTemplates/ContentTypeList") return;
                vm.contentLink = args.contentLink;
                vm.parentLink = args.parentLink;
                vm.render();
            });
        },
        postCreate: function(){
            this.render();
        },
        clear: function(){
            // summary:
            //		Destroys the current view.
            // tags:
            //		public

            array.forEach(this.getChildren(), function (child) {
                this.removeChild(child);
                child.destroyRecursive();
            }, this);
        },
        render: function () {
            // summary:
            //      Construct the base UI with suggested content types.
            // tags:
            //      protected
            this.inherited(arguments);
            this.clear();

            var suggested = new ContentTypeGroup({ templatesRoot: this.templatesRoot, contentLink: this.contentLink });

            domClass.add(suggested.titleNode, "epi-ribbonHeaderSpecial");
            suggested.set("title", "Available Instant Templates");
            suggested.set("templatesRoot", this.templatesRoot);
            suggested.setVisibility(true);
            this.addChild(suggested);
            this._suggestedContentTypes = suggested;

            this.set("shouldSkipContentTypeSelection", false);
        }
    });

});