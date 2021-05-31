// ! rx1310 <rx1310@inbox.ru> | Copyright (c) rx1310, 2021 | GPLv2

const { Clutter, Gio, GLib, GObject, Shell, St } = imports.gi;

const eu = imports.misc.extensionUtils;
const m = imports.ui.main;
const u = imports.misc.util;
const e = eu.getCurrentExtension();
const p = imports.ui.panelMenu;
const pm = imports.ui.popupMenu;
const Gettext = imports.gettext;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

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

      let r = "read -p 'Название пакета: ' pkgName; ";

      this.menu.addAction("Обновить списки и пакеты", (_) => { this.execAction("sudo apt update && sudo apt upgrade -y"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.menu.addAction("Обновить списки пакетов", (_) => { this.execAction("sudo apt update"); });
      this.menu.addAction("Обновить пакеты", (_) => { this.execAction("sudo apt upgrade"); });
      this.menu.addAction("Обновить пакеты (full-upgrade)", (_) => { this.execAction("sudo apt full-upgrade"); });
      this.menu.addAction("Доступные обновления", (_) => { this.execAction("sudo apt list --upgradable"); });
      this.menu.addAction("Установленные пакеты", (_) => { this.execAction("sudo apt list --installed"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.menu.addAction("Установить пакет", (_) => { this.execAction(r + "sudo apt install $pkgName"); });
      this.menu.addAction("Переустановить пакет", (_) => { this.execAction(r + "sudo apt install $pkgName --reinstall"); });
      this.menu.addAction("Скачать пакет", (_) => { this.execAction(r + "apt download $pkgName"); });
      this.menu.addAction("Поиск пакетов", (_) => { this.execAction(r + "sudo apt search $pkgName"); });
      this.menu.addAction("Удалить пакет", (_) => { this.execAction(r + "sudo apt remove $pkgName"); });
      this.menu.addAction("Удалить пакет (+ конфиг.)", (_) => { this.execAction(r + "sudo apt purge $pkgName"); });
      this.menu.addAction("Удалить лишние пакеты", (_) => { this.execAction("sudo apt autoremove"); });
      
      this.menu.addAction("Очистить кеш пакетов", (_) => { this.execAction("sudo apt autoclean"); });
      this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());
      this.menu.addAction("Статистика кеша", (_) => { this.execAction("apt-cache stats"); });
      this.menu.addAction("Найти информацию о пакете", (_) => {this.execAction(r + "apt-cache search $pkgName"); });
      this.menu.addAction("Список доступных пакетов", (_) => { this.execAction("apt-cache pkgnames"); });

      //this.menu.addMenuItem(new pm.PopupSeparatorMenuItem());

      //this.menu.addAction("", (_) => { this.execAction(""); });

    }

    execAction(command) {
      try {
        u.trySpawnCommandLine(
          'gnome-terminal -x bash -c "echo Нажмите Ctrl + C, если хотите отменить действие.;' +
            command +
            "; echo; echo ; read -n 1 -s -r -p 'Нажмите любую кнопку для закрытия окна.'\""
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
    this.term_snippets = new AptShortcutsMenu();
    m.panel.addToStatusArea("apt-shortcuts", this.term_snippets);
  }

  disable() {}
}

function init() {
  return new Extension();
}
