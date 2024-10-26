"use client";

import { useState } from "react";
import { EscotaButton } from "../escota_button/escota_button";
import { HeaderSubmenu } from "./header_submenu";
import { MenuSection, UserModel } from "hegel";

export type Args = {
    user: UserModel
    menuSections: MenuSection[]
}

export const UserMenu = ({ user, menuSections }: Args): JSX.Element => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function toggleMenu(changeTo?: boolean) {
        setIsMenuOpen(changeTo ?? !isMenuOpen);
    }

    return (
        <div className="relative inline-block">
            <button
                onMouseEnter={() => toggleMenu(true)}
                onFocus={() => toggleMenu(true)}
            >
                <EscotaButton text={`Hola, ${user.name ?? user.email}`} variant="transparent" classname="focus:outline-none" />
            </button>
            {isMenuOpen && <div className="absolute left-0 z-10">
                <HeaderSubmenu toggleMenu={toggleMenu} menuSections={menuSections} />
            </div>}
        </div>
    );

};
