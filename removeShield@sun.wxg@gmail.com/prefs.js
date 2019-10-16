const Gtk = imports.gi.Gtk;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
let gsettings;

const SCHEMA_NAME = 'org.gnome.shell.extensions.removeShield';

function init() {
    gsettings = Convenience.getSettings(SCHEMA_NAME);
}

function buildPrefsWidget() {
    let widget = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        border_width: 10
    });

    let vbox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin: 20, margin_top: 10
    });
    vbox.set_size_request(550, 350);

    addBoldTextToBox("Enable or Disable Shield", vbox);
    vbox.add(new Gtk.HSeparator({margin_bottom: 5, margin_top: 5}));

    let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });

    let setting_label = new Gtk.Label({ label: "Enable remove shield", xalign: 0 });

    let setting_switch = new Gtk.Switch({ active: gsettings.get_boolean('switch') });

    setting_switch.connect('notify::active',
                   function (button) { gsettings.set_boolean('switch', button.active); });

    hbox.pack_start(setting_label, true, true, 0);
    hbox.add(setting_switch);
    vbox.add(hbox);

    widget.add(vbox);

    widget.show_all();
    return widget;
}

function addBoldTextToBox(text, box) {
    let txt = new Gtk.Label({xalign: 0});
    txt.set_markup('<b>' + text + '</b>');
    txt.set_line_wrap(true);
    box.add(txt);
}
