const angleMap = {
    "─": [0, 90],
    "│": [90, 180],
    "┌": [0, 0],
    "┐": [180, 0],
    "┘": [270, 90],
    "└": [270, 270],
    " ": [135, -135],
};
// prettier-ignore
const zero = [ 
    "┌", "─", "─", "┐",
    "│", "┌", "┐", "│",
    "│", "│", "│", "│",
    "│", "│", "│", "│",
    "│", "└", "┘", "│",
    "└", "─", "─", "┘"
];
// prettier-ignore
const one = [
    "┌", "─", "┐", " ",
    "└", "┐", "│", " ",
    " ", "│", "│", " ",
    " ", "│", "│", " ",
    "┌", "┘", "└", "┐",
    "└", "─", "─", "┘"
];
// prettier-ignore
const two = [
    "┌", "─", "─", "┐",
    "└", "─", "┐", "│",
    "┌", "─", "┘", "│", 
    "│", "┌", "─", "┘",
    "│", "└", "─", "┐",
    "└", "─", "─", "┘"
];
// prettier-ignore
const three = [
    "┌", "─", "─", "┐",
    "└", "─", "┐", "│",
    "┌", "─", "┘", "│",
    "└", "─", "┐", "│",
    "┌", "─", "┘", "│",
    "└", "─", "─", "┘"  
];
// prettier-ignore
const four = [
    "┌", "┐", "┌", "┐",
    "│", "│", "│", "│",
    "│", "└", "┘", "│",  
    "└", "─", "┐", "│",
    " ", " ", "│", "│",
    " ", " ", "└", "┘"
];
// prettier-ignore
const five = [
    "┌", "─", "─", "┐",
    "│", "┌", "─", "┘",
    "│", "└", "─", "┐",
    "└", "─", "┐", "│",
    "┌", "─", "┘", "│",
    "└", "─", "─", "┘"  
];
// prettier-ignore
const six = [
    "┌", "─", "─", "┐",
    "│", "┌", "─", "┘",
    "│", "└", "─", "┐",
    "│", "┌", "┐", "│",
    "│", "└", "┘", "│",
    "└", "─", "─", "┘"
];
// prettier-ignore
const seven = [
    "┌", "─", "─", "┐",
    "└", "─", "┐", "│",
    " ", " ", "│", "│",
    " ", " ", "│", "│",
    " ", " ", "│", "│",
    " ", " ", "└", "┘"
];
// prettier-ignore
const eight = [ 
    "┌", "─", "─", "┐",
    "│", "┌", "┐", "│",
    "│", "└", "┘", "│",
    "│", "┌", "┐", "│",
    "│", "└", "┘", "│",
    "└", "─", "─", "┘"
];
// prettier-ignore
const nine = [
    "┌", "─", "─", "┐",
    "│", "┌", "┐", "│",
    "│", "└", "┘", "│",
    "└", "─", "┐", "│",
    "┌", "─", "┘", "│",
    "└", "─", "─", "┘"
];

const digits = { 1: one, 2: two, 3: three, 4: four, 5: five, 6: six, 7: seven, 8: eight, 9: nine, 0: zero };

function createClockContainer() {
    const digitContainer = document.createElement("div");
    digitContainer.className = "digit-container";

    for (let i = 0; i < 2; i++) {
        const clockContainer = document.createElement("div");
        clockContainer.className = "clock-container";
        document.body.appendChild(clockContainer);

        // for loop to create 24 clock faces
        for (let i = 0; i < 24; i++) {
            const clockFace = document.createElement("div");
            clockFace.className = "clock";
            clockContainer.appendChild(clockFace);

            const hourHand = document.createElement("div");
            hourHand.className = "hour hand";
            clockFace.appendChild(hourHand);

            const minuteHand = document.createElement("div");
            minuteHand.className = "minute hand";
            clockFace.appendChild(minuteHand);
        }
        digitContainer.appendChild(clockContainer);
    }
    document.body.appendChild(digitContainer);
}

function updateClocks() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const timeString =
        String(hours).padStart(2, "0") + String(minutes).padStart(2, "0") + String(seconds).padStart(2, "0");

    const clockContainers = document.getElementsByClassName("clock-container");
    for (let i = 0; i < timeString.length; i++) {
        var j = 0;
        for (const clockFace of clockContainers[i].children) {
            const char = timeString[i];
            const digitArray = digits[char];

            const hourHand = clockFace.children[0];
            const minuteHand = clockFace.children[1];

            const minuteAngle = angleMap[digitArray[j]][0];
            const hourAngle = angleMap[digitArray[j]][1];

            minuteHand.style.transform = `rotate(${minuteAngle}deg) translate(0, -50%)`;
            hourHand.style.transform = `rotate(${hourAngle}deg) translate(0, -50%)  `;
            j++;
        }
    }
}

// do this 6 times in a loop
for (let i = 0; i < 3; i++) {
    createClockContainer();
}

setInterval(updateClocks, 1000);
