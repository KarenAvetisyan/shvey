"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // Initialize all tab boxes
    document.querySelectorAll(".tab--box").forEach(initTab);

    function initTab(tab) {
        if (!tab || tab.classList.contains("tab--box--initialized")) return;

        const cardClassName = "tab--box";
        const tabDataAttributeName = "data-tab-id";
        const tabClassName = `${cardClassName}__tab`;
        const tabSectionClassName = `${cardClassName}__section`;
        const tabSectionsContainerClassName = `${cardClassName}__body`;
        const tabSectionsContainerSelector = `.${tabSectionsContainerClassName}`;
        const tabSelector = `.${tabClassName}[${tabDataAttributeName}]`;
        const tabSectionSelector = `.${tabSectionClassName}`;
        const activeTabClassName = `${tabClassName}--active`;
        const activeSectionClassName = `${tabSectionClassName}--active`;

        // Filter nodes belonging only to THIS exact tab
        const filterToThisTab = (nodes) =>
            [...nodes].filter((n) => n.closest(".tab--box") === tab);

        const tabs = filterToThisTab(tab.querySelectorAll(tabSelector));
        const sections = filterToThisTab(tab.querySelectorAll(tabSectionSelector));
        const tabSectionsContainer = tab.querySelector(tabSectionsContainerSelector);

        let mutationObserver = null;
        let resizeObserver = null;

        const setTabInactive = (t) => t?.classList.remove(activeTabClassName);
        const setTabActive = (t) => t?.classList.add(activeTabClassName);
        const setSectionInactive = (s) =>
            s?.classList.remove(activeSectionClassName);

        // ACTIVE TAB + ACTIVE SECTION — FIXED ✅
        const getCurrentlyActiveTab = () =>
            tabs.find((t) => t.classList.contains(activeTabClassName)) || null;

        const getCurrentlyActiveSection = () =>
            sections.find((s) => s.classList.contains(activeSectionClassName)) || null;

        const getSectionHeight = (section) => {
            if (!section) return 0;
            const style = getComputedStyle(section);
            const mt = parseFloat(style.marginTop) || 0;
            const mb = parseFloat(style.marginBottom) || 0;
            return section.scrollHeight + mt + mb;
        };

        const changeSectionsContainerHeight = (section) => {
            if (!section || !tabSectionsContainer) return;
            tabSectionsContainer.style.height = `${getSectionHeight(section)}px`;
        };

        const observeResize = (section) => {
            if (!section) return;
            if (resizeObserver) resizeObserver.disconnect();

            resizeObserver = new ResizeObserver(() =>
                changeSectionsContainerHeight(section)
            );
            resizeObserver.observe(section);
        };

        const observeMutations = (section) => {
            if (!section) return;
            if (mutationObserver) mutationObserver.disconnect();

            mutationObserver = new MutationObserver(() =>
                changeSectionsContainerHeight(section)
            );
            mutationObserver.observe(section, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["style", "class"],
            });
        };

        const setSectionActive = (sectionId) => {
            const section = sections.find((s) => s.id === sectionId);
            if (!section) return;

            section.classList.add(activeSectionClassName);

            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    changeSectionsContainerHeight(section);
                    observeMutations(section);
                    observeResize(section);
                })
            );
        };

        const changeTab = (tabButton) => {
            if (!tabButton) return;
            if (tabButton.closest(".tab--box") !== tab) return;

            const sectionId = tabButton.getAttribute(tabDataAttributeName);
            if (!sectionId) return;

            setTabInactive(getCurrentlyActiveTab());
            setSectionInactive(getCurrentlyActiveSection());

            setTabActive(tabButton);
            setSectionActive(sectionId);
        };

        const updateSectionsContainerHeight = () => {
            const activeSection = getCurrentlyActiveSection();
            if (activeSection) changeSectionsContainerHeight(activeSection);
        };

        // Mark initialized
        tab.classList.add("tab--box--initialized");

        const initialTab = getCurrentlyActiveTab() || tabs[0];

        requestAnimationFrame(() =>
            requestAnimationFrame(() => changeTab(initialTab))
        );

        tabs.forEach((t) =>
            t.addEventListener("click", () => changeTab(t))
        );

        window.addEventListener("load", updateSectionsContainerHeight);
        window.addEventListener("resize", updateSectionsContainerHeight);

    }
});