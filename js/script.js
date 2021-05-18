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

		$('table').addClass('table-dark');
	}
	else
	{
		document.documentElement.style.setProperty('--background', '#FFFFFF');
		document.documentElement.style.setProperty('--backgroundDarker1', '#F5F5F5');
		document.documentElement.style.setProperty('--backgroundDarker2', '#CCCCCC');

		document.documentElement.style.setProperty('--foreground', '#262626');

		$('table').removeClass('table-dark');
	}
		
}