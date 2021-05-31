// ! rx1310 <rx1310@inbox.ru> | Copyright (c) rx1310, 2021 | GPLv2

const { Clutter, Gio, GLib, GObject, Shell, St } = imports.gi;

const eu = imports.misc.extensionUtils;
const m = imports.ui.main;
const u = imports.misc.util;
const e = eu.getCurrentExtension();
const p = imports.ui.panelMenu;
const pm = imports.ui.popupMenu;

var AptShortcutsMenu = GObject.registerClass(

  class AptShortcutsMenu extends p.Button {

    _init() {

      super._init(0.0, "Shortcuts for APT");

      let h = new St.BoxLayout({
        style_class: 'panel-status-menu-box'
      });

      let l = new St.Label({
        text: 'APT',
        y_expand: true,
        y_align: Clutter.ActorAlign.CENTER
      });

      h.add_child(l);
      //h.add_child(pm.arrowIcon(St.Side.BOTTOM));

      this.add_actor(h);

      let r = "read -p 'Package name: ' pkgName; ";

      this.menu.addAction("Update packages & lists", (_) => { this.execAction("pkexec apt update && pkexec apt upgrade -y"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.menu.addAction("Update packages lists", (_) => { this.execAction("pkexec apt update"); });
      this.menu.addAction("Update packages", (_) => { this.execAction("pkexec apt upgrade"); });
      this.menu.addAction("Update packages (full-upgrade)", (_) => { this.execAction("pkexec apt full-upgrade"); });
      this.menu.addAction("Updates list", (_) => { this.execAction("pkexec apt list --upgradable"); });
      this.menu.addAction("Installed packages list", (_) => { this.execAction("pkexec apt list --installed"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.menu.addAction("Install package", (_) => { this.execAction(r + "pkexec apt install $pkgName"); });
      this.menu.addAction("Reinstall package", (_) => { this.execAction(r + "pkexec apt install $pkgName --reinstall"); });
      this.menu.addAction("Download package", (_) => { this.execAction(r + "apt download $pkgName"); });
      this.menu.addAction("Search package", (_) => { this.execAction(r + "pkexec apt search $pkgName"); });
      this.menu.addAction("Uninstall package", (_) => { this.execAction(r + "pkexec apt remove $pkgName"); });
      this.menu.addAction("Uninstall package (purge)", (_) => { this.execAction(r + "pkexec apt purge $pkgName"); });
      this.menu.addAction("Remove unnecessary packages", (_) => { this.execAction("pkexec apt autoremove"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.footer = new pm.PopupMenuItem('Shortcuts for APT by @rx1310');
      this.footer.reactive = false;
		  this.menu.addMenuItem(this.footer);
      
      // this.menu.addAction("Очистить кеш пакетов", (_) => { this.execAction("pkexec apt autoclean"); });
      // this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      // this.menu.addAction("Статистика кеша", (_) => { this.execAction("apt-cache stats"); });
      // this.menu.addAction("Найти информацию о пакете", (_) => {this.execAction(r + "apt-cache search $pkgName"); });
      // this.menu.addAction("Список доступных пакетов", (_) => { this.execAction("apt-cache pkgnames"); });

      //this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());

      //this.menu.addAction("", (_) => { this.execAction(""); });

    }

    execAction(command) {
      try {
        u.trySpawnCommandLine(
          'gnome-terminal -x bash -c "echo Press Ctrl + C if you want to undo the action.;' +
            command +
            "; echo; echo ; read -n 1 -s -r -p 'Press any button to close the window.'\""
        );
        //m.notify('APT: Готово!', 'Нажмите любую кнопку для закрытия окна.');
      } catch (err) {
        m.notify("Error: unable to execute command in GNOME Terminal");
      }
    }

  }

);

class Extension {
  constructor() {}

  enable() {
    this.apt_shortcuts = new AptShortcutsMenu();
    m.panel.addToStatusArea("apt-shortcuts", this.apt_shortcuts);
  }

  disable() {}
}

function init() {
  return new Extension();
}
