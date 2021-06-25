const Gray = "#282828";
const GrayDarker1 = "#333333";
const GrayDarker2 = "#444444";

const White = "#EAEAEA";
const WhiteDarker1 = "#FBFBFB";
const WhiteDarker2 = "#FFFFFF";

document.documentElement.style.setProperty('--customRed', '#990000');

function ChangeTheme()
{
	if(localStorage.getItem("Tema") == 'L')
	{
		document.documentElement.style.setProperty('--background', Gray);
		document.documentElement.style.setProperty('--backgroundDarker1', GrayDarker1);
		document.documentElement.style.setProperty('--backgroundDarker2', GrayDarker2);

		document.documentElement.style.setProperty('--foreground', White);
		document.documentElement.style.setProperty('--foreground', WhiteDarker1);

		localStorage.setItem("Tema", 'D');
	}
	else
	{
		document.documentElement.style.setProperty('--background', White);
		document.documentElement.style.setProperty('--backgroundDarker1', WhiteDarker1);
		document.documentElement.style.setProperty('--backgroundDarker2', WhiteDarker2);

		document.documentElement.style.setProperty('--foreground', Gray);
		document.documentElement.style.setProperty('--foregroundDarker1', GrayDarker1);

		localStorage.setItem("Tema", 'L');
	}
		
}

$('body').on('click', 'button', function() 
{
	console.log()
    $(this).find('.fa-caret-down').toggleClass("up");
});