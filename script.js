document.addEventListener("DOMContentLoaded", function () {

    let itemData;
    let labels;
    let dataForChart;
    let config;
    let charter;

    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const select = dropdown.querySelector('.select');
        const caret = dropdown.querySelector('.caret');
        const menu = dropdown.querySelector('.menu');
        const cityDropdown = document.getElementById('cityDropdown');
        const cityNames = [];

        //Afisare date default
        updateContent("București", 44.43, 26.10);
        select.addEventListener('click', () => {
            if (document.activeElement === select && menu.classList.contains('menu-open')) {
                select.blur();
            }

            if (document.activeElement === select) select.value = "";

        })

        //Crearea elementelor din dropdown

        jsonData.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = entry.city;
            cityNames.push(entry.city);

            listItem.addEventListener('click', () => {
                console.log('CLICKED');
                select.value = listItem.innerText;
                select.classList.remove('select-clicked');
                caret.classList.remove('caret-rotate');
                menu.classList.remove('menu-open');
                const options = dropdown.querySelectorAll('.menu li');
                options.forEach(option => {
                    option.classList.remove('active');
                });
                listItem.classList.add('active');
                handleCitySelection(entry.city);
                updateContent(entry.city, entry.lat, entry.lng);
            });
            cityDropdown.appendChild(listItem);
        });

        function handleCitySelection(selectedCity) {
            console.log(`You selected: ${selectedCity}`);
        }

        select.addEventListener("input", onInputChange);

        function onInputChange() {
            const value = select.value
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            const filteredNames = [];

            cityNames.forEach((name) => {
                if (name.substr(0, value.length)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase() === value) filteredNames.push(name);
            })
            if (filteredNames.length != 0 &&
                filteredNames[0] != null &&
                filteredNames[0] != undefined)
                createAutocompleteDropdown(filteredNames[0]);
        }

        function createAutocompleteDropdown(name) {
            const options = dropdown.querySelectorAll('.menu li');
            options.forEach(option => {
                if (option.innerHTML
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    ==
                    name
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()) {
                    option.focus();
                    option.scrollIntoView({ behavior: "auto" });
                }
            })
            select.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    select.value = name;
                    jsonData.forEach(entry => {
                        if (entry.city == name) {
                            updateContent(name, entry.lat, entry.lng);
                            menu.classList.remove('menu-open');
                        }
                    })
                    select.blur();
                }
            })
        }

        //Updatarea informatiitlor de pe pagina
        function updateContent(selectedCity, latitude, longitude) {
            const cityName = document.querySelector('.city');
            cityName.innerHTML = selectedCity;
            const currentHour = new Date().getHours();
            const temp = document.querySelector('.temp');
            const humidity = document.querySelector('.humidity');
            const wind = document.querySelector('.wind');
            const weather_icon = document.querySelector('.weather-icon');


            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,rain,showers,snowfall&daily=precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,windspeed_10m_max&forecast_days=1`)
                .then(res => {
                    if (res.ok) {
                        console.log('SUCCESS');
                        return res.json();
                    } else {
                        console.log('NOT SUCCESSFUL')
                    }
                })
                .then(data => {
                    console.log(data);
                    temp.innerHTML = Math.round(data.hourly.apparent_temperature[currentHour]) + "°c";
                    humidity.innerHTML = Math.round(data.daily.precipitation_probability_max) + "%";
                    wind.innerHTML = Math.round(data.daily.windspeed_10m_max) + " km/h";

                    weather_icon.src = 'images/clear.png';
                    if (data.daily.precipitation_probability_max > 50 && data.daily.snowfall_sum[0] == 0) weather_icon.src = 'images/rain.png';
                    if (data.daily.precipitation_probability_max > 50 && data.daily.snowfall_sum[0] > 0) weather_icon.src = 'images/snow.png';

                    itemData = [
                        data.hourly.apparent_temperature[0],
                        data.hourly.apparent_temperature[4],
                        data.hourly.apparent_temperature[8],
                        data.hourly.apparent_temperature[12],
                        data.hourly.apparent_temperature[16],
                        data.hourly.apparent_temperature[20],
                        data.hourly.apparent_temperature[0],
                    ];

                    //console.log(itemData);

                    labels = ['0:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00'];

                    dataForChart = {
                        labels: labels,
                        datasets: [{
                            data: itemData,
                            backgroundColor: 'rgb(219, 154, 24)',
                            borderColor: 'rgb(219, 154, 24)',
                            cubicInterpolationMode: 'monotone',
                            fill: 'origin',
                            pointRadius: 0
                        }]
                    };

                    config = {
                        type: 'line',
                        data: dataForChart,
                        scaleFontColor: 'red',
                        options: {
                            scaleFontColor: 'red',
                            plugins: {
                                tooltip: {
                                    events: ['click'],
                                    backgroundColor: 'rgb(219, 154, 24)',
                                    titleColor: '#fff'
                                },
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        color: 'white'
                                    }
                                }
                                ,
                                y: {
                                    ticks: {
                                        color: 'white'
                                    }
                                }
                                ,
                            }
                        }
                    };
                    try {
                        charter = new Chart(
                            document.getElementById('Chart'),
                            config
                        )
                    } catch (error) {
                        charter.destroy();
                        charter = new Chart(document.getElementById('Chart'),
                            config)
                    }
                })
        }

        select.addEventListener('click', () => {
            caret.classList.toggle('caret-rotate');
            menu.classList.toggle('menu-open');
        });
    });


});