ifeq ($(strip $(DESTDIR)),)
	INSTALLBASE = $(HOME)/.local/share/gnome-shell/extensions
else
	SHARE_PREFIX = $(DESTDIR)/usr/share
	INSTALLBASE = $(SHARE_PREFIX)/gnome-shell/extensions
endif
NAME=removeShield
INSTALLNAME=$(NAME)@sun.wxg@gmail.com

schemas:
	glib-compile-schemas $(INSTALLNAME)/schemas/
submit: schemas
	cd $(INSTALLNAME)/ && zip -r ~/$(NAME).zip *

install:
	rm -rf $(INSTALLBASE)/$(INSTALLNAME)
	mkdir -p $(INSTALLBASE)/$(INSTALLNAME)
	cp -r $(INSTALLNAME)/* $(INSTALLBASE)/$(INSTALLNAME)/
