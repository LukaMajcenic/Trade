document.documentElement.style.setProperty('--background', '#FFFFFF');
document.documentElement.style.setProperty('--backgroundDarker1', '#F5F5F5');
document.documentElement.style.setProperty('--backgroundDarker2', '#CCCCCC');

document.documentElement.style.setProperty('--foreground', '#262626');

document.documentElement.style.setProperty('--customRed', '#990000');

function ChangeTheme()
{
	if(document.documentElement.style.getPropertyValue('--background') == '#FFFFFF')
	{
		document.documentElement.style.setProperty('--background', '#262626');
		document.documentElement.style.setProperty('--backgroundDarker1', '#161616');
		document.documentElement.style.setProperty('--backgroundDarker2', '#101010');

		document.documentElement.style.setProperty('--foreground', '#F5F5F5');

		localStorage.setItem("darkTheme", true);
	}
	else
	{
		document.documentElement.style.setProperty('--background', '#FFFFFF');
		document.documentElement.style.setProperty('--backgroundDarker1', '#F5F5F5');
		document.documentElement.style.setProperty('--backgroundDarker2', '#CCCCCC');

		document.documentElement.style.setProperty('--foreground', '#262626');

		localStorage.setItem("darkTheme", false);
	}
		
}