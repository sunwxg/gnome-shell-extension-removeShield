// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const Main = imports.ui.main;
const ScreenShield = imports.ui.screenShield;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const SCHEMA_NAME = 'org.gnome.shell.extensions.removeShield';

class RemoveShield {
    constructor() {
        this.gsettings = Convenience.getSettings(SCHEMA_NAME);

        this.onUserBecameActiveOrigin = Main.screenShield._onUserBecameActive;
        this._ensureUnlockDialogOrigin = Main.screenShield._ensureUnlockDialog;
        this._liftShieldOrigin = Main.screenShield._liftShield;

        this.signalPowerId = this.gsettings.connect("changed::switch", this._switchChanged.bind(this));

        this._switchChanged();
    }

    _switchChanged() {
        if (this.gsettings.get_boolean('switch')) {
            Main.screenShield._onUserBecameActive = _onUserBecameActive;
            Main.screenShield._ensureUnlockDialog = _ensureUnlockDialog;
            Main.screenShield._liftShield = _liftShield;
        } else {
            Main.screenShield._onUserBecameActive = this.onUserBecameActiveOrigin;
            Main.screenShield._ensureUnlockDialog = this._ensureUnlockDialogOrigin;
            Main.screenShield._liftShield = this._liftShieldOrigin;
        }
    }
}

function _onUserBecameActive() {
    this.idleMonitor.remove_watch(this._becameActiveId);
    this._becameActiveId = 0;

    if (this._isActive || this._isLocked) {
        this._longLightbox.hide();
        this._shortLightbox.hide();
        //remove shield
        this._liftShield(true, 0);
    } else {
        this.deactivate(false);
    }
}

function _ensureUnlockDialog(onPrimary, allowCancel) {
    if (!this._dialog) {
        let constructor = Main.sessionMode.unlockDialog;
        if (!constructor) {
            // This session mode has no locking capabilities
            this.deactivate(true);
            return false;
        }

        this._dialog = new constructor(this._lockDialogGroup);


        let time = global.get_current_time();
        if (!this._dialog.open(time, onPrimary)) {
            // This is kind of an impossible error: we're already modal
            // by the time we reach this...
            log('Could not open login dialog: failed to acquire grab');
            this.deactivate(true);
            return false;
        }

        //remove shield
        //this._dialog.connect('failed', Lang.bind(this, this._onUnlockFailed));
    }

    this._dialog.allowCancel = allowCancel;
    return true;
}

function _liftShield(onPrimary, velocity) {
    if (this._isLocked) {
        if (this._ensureUnlockDialog(onPrimary, true /* allowCancel */))
            this._hideLockScreen(false/* animate */, 0);
    } else {
        this.deactivate(true /* animate */);
    }
}

var removeShield;

function init() {
    removeShield = new RemoveShield();
}

function enable() {
}

function disable() {
}
