"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_es_1 = require("lodash-es");
var emitter_1 = require("../core/emitter");
var base_1 = require("./base");
var link_1 = require("../formats/link");
var selection_1 = require("../core/selection");
var icons_1 = require("../ui/icons");
var TOOLBAR_CONFIG = [
    [{ header: ['1', '2', '3', false] }],
    ['bold', 'italic', 'underline', 'link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
];
var SnowTooltip = /** @class */ (function (_super) {
    __extends(SnowTooltip, _super);
    function SnowTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.preview = _this.root.querySelector('a.ql-preview');
        return _this;
    }
    SnowTooltip.prototype.listen = function () {
        var _this = this;
        _super.prototype.listen.call(this);
        // @ts-expect-error Fix me later
        this.root
            .querySelector('a.ql-action')
            .addEventListener('click', function (event) {
            if (_this.root.classList.contains('ql-editing')) {
                _this.save();
            }
            else {
                // @ts-expect-error Fix me later
                _this.edit('link', _this.preview.textContent);
            }
            event.preventDefault();
        });
        // @ts-expect-error Fix me later
        this.root
            .querySelector('a.ql-remove')
            .addEventListener('click', function (event) {
            if (_this.linkRange != null) {
                var range = _this.linkRange;
                _this.restoreFocus();
                _this.quill.formatText(range, 'link', false, emitter_1.default.sources.USER);
                delete _this.linkRange;
            }
            event.preventDefault();
            _this.hide();
        });
        this.quill.on(emitter_1.default.events.SELECTION_CHANGE, function (range, oldRange, source) {
            if (range == null)
                return;
            if (range.length === 0 && source === emitter_1.default.sources.USER) {
                var _a = _this.quill.scroll.descendant(link_1.default, range.index), link = _a[0], offset = _a[1];
                if (link != null) {
                    _this.linkRange = new selection_1.Range(range.index - offset, link.length());
                    var preview = link_1.default.formats(link.domNode);
                    // @ts-expect-error Fix me later
                    _this.preview.textContent = preview;
                    // @ts-expect-error Fix me later
                    _this.preview.setAttribute('href', preview);
                    _this.show();
                    var bounds = _this.quill.getBounds(_this.linkRange);
                    if (bounds != null) {
                        _this.position(bounds);
                    }
                    return;
                }
            }
            else {
                delete _this.linkRange;
            }
            _this.hide();
        });
    };
    SnowTooltip.prototype.show = function () {
        _super.prototype.show.call(this);
        this.root.removeAttribute('data-mode');
    };
    SnowTooltip.TEMPLATE = [
        '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
        '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
        '<a class="ql-action"></a>',
        '<a class="ql-remove"></a>',
    ].join('');
    return SnowTooltip;
}(base_1.BaseTooltip));
var SnowTheme = /** @class */ (function (_super) {
    __extends(SnowTheme, _super);
    function SnowTheme(quill, options) {
        var _this = this;
        if (options.modules.toolbar != null &&
            options.modules.toolbar.container == null) {
            options.modules.toolbar.container = TOOLBAR_CONFIG;
        }
        _this = _super.call(this, quill, options) || this;
        _this.quill.container.classList.add('ql-snow');
        return _this;
    }
    SnowTheme.prototype.extendToolbar = function (toolbar) {
        if (toolbar.container != null) {
            toolbar.container.classList.add('ql-snow');
            this.buildButtons(toolbar.container.querySelectorAll('button'), icons_1.default);
            this.buildPickers(toolbar.container.querySelectorAll('select'), icons_1.default);
            // @ts-expect-error
            this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
            if (toolbar.container.querySelector('.ql-link')) {
                this.quill.keyboard.addBinding({ key: 'k', shortKey: true }, function (_range, context) {
                    toolbar.handlers.link.call(toolbar, !context.format.link);
                });
            }
        }
    };
    return SnowTheme;
}(base_1.default));
SnowTheme.DEFAULTS = (0, lodash_es_1.merge)({}, base_1.default.DEFAULTS, {
    modules: {
        toolbar: {
            handlers: {
                link: function (value) {
                    if (value) {
                        var range = this.quill.getSelection();
                        if (range == null || range.length === 0)
                            return;
                        var preview = this.quill.getText(range);
                        if (/^\S+@\S+\.\S+$/.test(preview) &&
                            preview.indexOf('mailto:') !== 0) {
                            preview = "mailto:".concat(preview);
                        }
                        var tooltip = this.quill.theme.tooltip;
                        tooltip.edit('link', preview);
                    }
                    else {
                        this.quill.format('link', false);
                    }
                },
            },
        },
    },
});
exports.default = SnowTheme;
