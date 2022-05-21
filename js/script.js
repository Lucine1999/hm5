const licenses_types_colors = ["green", "grey", "yellow"];
const licenses_container = document.querySelector(
    ".type-of-licenses-container"
);
const tabs_section = document.querySelector(".tabs-section");

const tabs_data_container = document.querySelector(".tabs-data-container");

function tabsListener() {
    let tabs_section_elems = document
        .querySelector(".tabs-section")
        .getElementsByTagName("p");
    Array.from(tabs_section_elems).forEach((elem) => {
        elem.addEventListener("click", function () {
            document.querySelectorAll(".tabs-section p").forEach((elem) => {
                elem.classList.remove("active");
            });
            this.classList.add("active");
            let tab_id = this.getAttribute("data-id");
            document.querySelectorAll(".tabs-data-section").forEach((elem) => {
                elem.classList.remove("active");
            });
            document
                .querySelector(".tabs-data-section-" + tab_id)
                .classList.add("active");
        });
    });
}

function createHorizontalSubLines() {
    const tablesCount = document.querySelectorAll(".child-systems-tables");

    tablesCount.forEach((elem) => {
        let length = elem.querySelectorAll("table").length;
        let vertical_line = elem.parentElement.querySelector(".vertical-line");
        let initialHeight = 63;
        let initialTop = 57;
        let currentTop = initialTop;
        let vertical_sub_line = document.createElement("div");
        vertical_sub_line.style.top = initialTop + "px";

        vertical_line.append(vertical_sub_line);

        if (length === 1) {
            return;
        }

        while (length > 1) {
            initialHeight += 52;
            currentTop += 52;

            let vertical_sub_line = document.createElement("div");
            vertical_sub_line.style.top = currentTop + "px";
            vertical_line.append(vertical_sub_line);

            length -= 1;
        }

        vertical_line.style.height = initialHeight + "px";
    });
    return;
}

function subsystemsCreate(subTableClone, subsystems) {
    subsystems.forEach((elem, index) => {
        if (index === 0) {
            subTableClone.querySelector(".licenses p").innerText =
                elem.licenses;
            subTableClone.querySelector(".expires p").innerText = elem.expires;
        } else {
            let secondarySubTable = document.getElementById("sub-table");
            let secondarySubTableClone =
                secondarySubTable.content.cloneNode(true);
            secondarySubTableClone.querySelector(".licenses p").innerText =
                elem.licenses;
            secondarySubTableClone.querySelector(".expires p").innerText =
                elem.expires;
            subTableClone
                .querySelector(".child-systems-tables")
                .append(secondarySubTableClone);
        }
    });

    return subTableClone;
}

function mainTableClick() {
    const mainTables = document.querySelectorAll(".main-table-click");

    mainTables.forEach((elem) => {
        let system_id = elem.getAttribute("system-id");
        elem.querySelector(".arrow-style").addEventListener(
            "click",
            function () {
                if (
                    document.querySelector(".sub-table-" + system_id).style
                        .display === "none"
                ) {
                    document.querySelector(
                        ".sub-table-" + system_id
                    ).style.display = "flex";
                    this.classList.remove("arrow-right");
                    this.classList.add("arrow-down");
                } else {
                    document.querySelector(
                        ".sub-table-" + system_id
                    ).style.display = "none";
                    this.classList.remove("arrow-down");
                    this.classList.add("arrow-right");
                }
            }
        );
    });
}

fetch("../js/data.json")
    .then((response) => response.json())
    .then((json) => {
        document.getElementsByTagName("h1")[0].innerText = json.page_title;
        json.plans.forEach((elem, index) => {
            let LicenseTypesTemplate = document.querySelector(
                "#license-types-template"
            );
            let LicenseTypesClone =
                LicenseTypesTemplate.content.cloneNode(true);
            if (elem.active) {
                LicenseTypesClone.querySelector(
                    ".type-of-license"
                ).classList.add("active");
            }

            let color = licenses_types_colors[index];

            if (!color) {
                color = "green";
            }
            LicenseTypesClone.querySelector(".chevron").classList.add(color);
            LicenseTypesClone.querySelector(".tooltip").classList.add(color);
            LicenseTypesClone.querySelector(".triangle").classList.add(color);
            LicenseTypesClone.querySelector(
                ".license-text"
            ).getElementsByTagName("p")[0].innerText = elem.name;
            licenses_container.append(LicenseTypesClone);
        });
        json.tabs.forEach((elem, index) => {
            let tabElem = document.createElement("p");
            tabElem.innerText = elem.title;
            tabElem.setAttribute("data-id", index + 1);
            let systemsAndSubsystems = elem.data;

            let systemsSectionMainTemplate =
                document.getElementById("systems-tables");
            let systemsSectionMainClone =
                systemsSectionMainTemplate.content.cloneNode(true);
            let systemsAppendSection = systemsSectionMainClone.querySelector(
                ".systems-table-main"
            );

            if ("systems" in elem.data) {
                tabElem.classList.add("active");

                let tabDataElem = document.createElement("div");
                tabDataElem.classList.add("tabs-data-section");
                tabDataElem.classList.add("tabs-data-section-" + (index + 1));
                tabDataElem.classList.add("active");

                systemsAndSubsystems.systems.forEach((elem, index) => {
                    let mainTableTemplate = document.getElementById(
                        "main-table-template"
                    );
                    let mainTableClone =
                        mainTableTemplate.content.cloneNode(true);
                    mainTableClone.querySelector(".system_name").innerText =
                        elem.system_name;
                    mainTableClone.querySelector(".id").innerText = elem.id;
                    mainTableClone.querySelector(".created_date").innerText =
                        elem.created_date;
                    mainTableClone.querySelector(".active_licenses").innerText =
                        elem.active_licenses;
                    mainTableClone
                        .querySelector(".main-table")
                        .setAttribute("system-id", index + 1);

                    let subsystems = systemsAndSubsystems.subsystems.filter(
                        (sub) => {
                            return elem.id === sub.system_id;
                        }
                    );

                    if (subsystems.length) {
                        mainTableClone
                            .querySelector(".arrow-style")
                            .classList.add("arrow-right");
                    }

                    systemsAppendSection.append(mainTableClone);
                    tabDataElem.append(systemsSectionMainClone);

                    tabs_data_container.append(tabDataElem);

                    if (subsystems.length) {
                        let subTableTemplate =
                            document.getElementById("subtable-template");
                        let subTableClone =
                            subTableTemplate.content.cloneNode(true);

                        subTableClone
                            .querySelector(".sub-table-container")
                            .classList.add("sub-table-" + (index + 1));
                        subTableClone.querySelector(
                            ".sub-table-container"
                        ).style.display = "none";

                        let subTableResult = subsystemsCreate(
                            subTableClone,
                            subsystems
                        );
                        systemsAppendSection.append(subTableResult);
                    }
                });
                createHorizontalSubLines();
            } else {
                let tabDataElem = document.createElement("div");

                tabDataElem.innerHTML = JSON.stringify(systemsAndSubsystems);
                tabDataElem.classList.add("tabs-data-section");
                tabDataElem.classList.add("tabs-data-section-" + (index + 1));
                tabDataElem.style.color = "#d6ddde";

                tabs_data_container.append(tabDataElem);
            }
            tabs_section.append(tabElem);
        });
        tabsListener();
        mainTableClick();
    });
