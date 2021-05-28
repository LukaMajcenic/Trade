const Gray = "#282828";
const GrayDarker1 = "#333333";
const GrayDarker2 = "#444444";

const White = "#DDDDDD";
const WhiteDarker1 = "#EEEEEE";
const WhiteDarker2 = "#FFFFFF";

document.documentElement.style.setProperty('--background', White);
document.documentElement.style.setProperty('--backgroundDarker1', WhiteDarker1);
document.documentElement.style.setProperty('--backgroundDarker2', WhiteDarker2);

document.documentElement.style.setProperty('--foreground', Gray);
document.documentElement.style.setProperty('--foregroundDarker1', GrayDarker1);

document.documentElement.style.setProperty('--customRed', '#990000');

function ChangeTheme()
{
	if(document.documentElement.style.getPropertyValue('--background') == White)
	{
		document.documentElement.style.setProperty('--background', Gray);
		document.documentElement.style.setProperty('--backgroundDarker1', GrayDarker1);
		document.documentElement.style.setProperty('--backgroundDarker2', GrayDarker2);

		document.documentElement.style.setProperty('--foreground', White);
		document.documentElement.style.setProperty('--foreground', WhiteDarker1);

		localStorage.setItem("darkTheme", true);
	}
	else
	{
		document.documentElement.style.setProperty('--background', White);
		document.documentElement.style.setProperty('--backgroundDarker1', WhiteDarker1);
		document.documentElement.style.setProperty('--backgroundDarker2', WhiteDarker2);

		document.documentElement.style.setProperty('--foreground', Gray);
		document.documentElement.style.setProperty('--foregroundDarker1', GrayDarker1);

		localStorage.setItem("darkTheme", false);
	}
		
}