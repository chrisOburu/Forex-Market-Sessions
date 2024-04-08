const digital = document.querySelector(".digital-clock");
const hourEl = digital.querySelector("#hour");
const minuteEl = digital.querySelector("#minutes");
const secondEl = digital.querySelector("#seconds");
const ampmEl = digital.querySelector("#ampm");

function updateClock() {
    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();
    let ampm = "AM";

    if (h > 12) {
        h = h - 12;
        ampm = "PM";
    }

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    hourEl.innerText = h;
    minuteEl.innerText = m;
    secondEl.innerText = s;
    ampmEl.innerText = ampm;
    setTimeout(() => {
        updateClock();
    }, 1000);
}

updateClock();

const sydneyHours = document.querySelector("#Sydney").querySelector(".hour");
const tokyoHours = document.querySelector("#Tokyo").querySelector(".hour");
const londonHours = document.querySelector("#London").querySelector(".hour");
const newYorkHours = document.querySelector("#NewYork").querySelector(".hour");

const hours = document.querySelectorAll(".hour");
const minutes = document.querySelectorAll(".minute");
const seconds = document.querySelectorAll(".second");

function setDate() {
    const now = new Date();
    const timezones = {
        "Sydney": +10,
        "Tokyo": +9,
        "London": +1,
        "New York": -4
    }

    const getSecond = now.getUTCSeconds();
    const getMinute = now.getUTCMinutes();
    const getHour = now.getUTCHours();

    const secondDegree = (getSecond / 60) * 360;
    const minuteDegree = (getMinute / 60) * 360;
    function hourDegree(getHour) {
        return (getHour / 12) * 360;
    }

    for (let second of seconds) {
        second.style.transform = `rotate(${secondDegree}deg)`
    }
    //second.style.transform = `rotate(${secondDegree}deg)`;
    for (let minute of minutes) {
        minute.style.transform = `rotate(${minuteDegree}deg)`
    }


    sydneyHours.style.transform = `rotate(${hourDegree(getHour + timezones["Sydney"])}deg)`;
    tokyoHours.style.transform = `rotate(${hourDegree(getHour + timezones["Tokyo"])}deg)`;
    londonHours.style.transform = `rotate(${hourDegree(getHour + timezones["London"])}deg)`;
    newYorkHours.style.transform = `rotate(${hourDegree(getHour + timezones["New York"])}deg)`;
}

setInterval(setDate, 1000);

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});


// fetch data from API

function fetchData() {
    fetch("https://worldtimeapi.org/api/timezone/")
        .then((response) => response.json())
        .then((timeZones) => {
            const region = document.querySelector("#region").value;
            changeCity(timeZones, region);
            check(timeZones);
            console.log("finished");
        })
        .catch((error) => {
            console.log(error);
        });
}

function changeCity(timeZones, region) {
    const africaCities = [];

    // Iterate through the array of time zones
    for (const timeZone of timeZones) {
        // Check if the time zone starts with "Africa/"
        if (timeZone.startsWith(region)) {
            // Extract the city name by removing "Africa/" from the beginning
            const city = timeZone.substring((region + "/").length);
            africaCities.push(city);
        }
    }
    const city = document.querySelector("#city");

    // Clear the existing options
    while (city.options.length > 0) {
        city.remove(0);
    }
    // Create an <option> element for each city
    for (const city of africaCities) {
        const option = document.createElement("option");
        option.value = city;
        option.text = city;
        document.getElementById("city").appendChild(option);
    }
}

function check(timeZones) {
    const region = document.getElementById('region');

    region.addEventListener('click', () => {
        const selected = region.options[region.selectedIndex].text;
        changeCity(timeZones, selected);
    })
}