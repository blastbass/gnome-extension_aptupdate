// ! rx1310 <rx1310@inbox.ru> | Copyright (c) rx1310, 2022 | GPLv2

const { Clutter, Gio, GLib, GObject, Shell, St } = imports.gi;

const eu = imports.misc.extensionUtils;
const m = imports.ui.main;
const u = imports.misc.util;
const e = eu.getCurrentExtension();
const p = imports.ui.panelMenu;
const pm = imports.ui.popupMenu;	

var DnfShortcutsMenu = GObject.registerClass(	
  class DnfShortcutsMenu extends p.Button {	
    _init() {	
      super._init(0.0, "Shortcuts for DNF");	
      let h = new St.BoxLayout({
        style_class: 'panel-status-menu-box'
      });	
      let l = new St.Label({
        text: 'DNF',
        y_expand: true,
        y_align: Clutter.ActorAlign.CENTER
      });	
      h.add_child(l);
      //h.add_child(pm.arrowIcon(St.Side.BOTTOM));	
      this.add_actor(h);	
      let r = "read -p 'Package name: ' pkgName; ";	
      this.menu.addAction("update", (_) => { this.execAction("pkexec dnf update"); });
      this.menu.addAction("upgrade --refresh", (_) => { this.execAction("pkexec dnf upgrade --refresh"); });
      this.menu.addAction("system-upgrade reboot", (_) => { this.execAction("pkexec dnf system-upgrade reboot"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.menu.addAction("repoquery --unsatisfied", (_) => { this.execAction("pkexec dnf repoquery --unsatisfied"); });
      this.menu.addAction("repoquery --duplicates", (_) => { this.execAction("pkexec dnf repoquery --duplicates"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.menu.addAction("list extras", (_) => { this.execAction("pkexec dnf list extras"); });
      this.menu.addAction("autoremove", (_) => { this.execAction("pkexec dnf autoremove"); });
      this.menu.addAction("rpm --rebuilddb", (_) => { this.execAction("pkexec rpm --rebuilddb"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.menu.addAction("distro-sync", (_) => { this.execAction("pkexec dnf distro-sync"); });
      this.menu.addAction("distro-sync --allowerasing", (_) => { this.execAction("pkexec dnf distro-sync --allowerasing"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      // this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.footer = new pm.PopupMenuItem('Shortcuts for DNF by @rx1310');
      this.footer.reactive = false;			  this.menu.addMenuItem(this.footer);	
      //this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());	
      //this.menu.addAction("", (_) => { this.execAction(""); });	
    }	
    execAction(command) {
      try {
        u.trySpawnCommandLine(
          'xfce4-terminal -x bash -c "echo Press Ctrl + C if you want to undo the action.;' +
            command +
            "; echo; echo ; read -n 1 -s -r -p 'Press any button to close the window.'\""
        );
        //m.notify('DNF: Error!', 'Terminal App Not Found!');
      } catch (err) {
        m.notify("Error: unable to execute command in GNOME Terminal");
      }
    }	
  }	
);	
class Extension {
  constructor() {}	
  enable() {
    this.dnf_shortcuts = new DnfShortcutsMenu();
    m.panel.addToStatusArea("dnf-shortcuts", this.dnf_shortcuts);
  }	
  disable () {
    this.dnf_shortcuts.destroy();
    this.dnf_shortcuts = null;
  }
}	
function init() {
  return new Extension();
}
