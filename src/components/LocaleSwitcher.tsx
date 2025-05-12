"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const globeIcon = ({

});

const LocaleSwitcher: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLocale = event.target.value;
        const segments = (pathname?.split("/").filter(Boolean)) || [];

        // Replace the first segment with the selected locale
        if (segments[0] === "en" || segments[0] === "vi") {
            segments[0] = selectedLocale;
        } else {
            segments.unshift(selectedLocale);
        }

        const newPath = `/${segments.join("/")}`;
        router.push(newPath);
    };

    return (
        <div>
            <select
                id="language-select"
                onChange={handleChange}
            >
                <option value="en">EN</option>
                <option value="vi">VI</option>
            </select>
        </div>
    );
};

export default LocaleSwitcher;
