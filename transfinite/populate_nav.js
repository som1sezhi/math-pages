var pageList = [
['', 'index.html', 'Transfinite Numbers'],
['1', '1_cardinals.html', 'Cardinals'],
['1.1', '1-1_intro_cardinals.html', 'An intro to cardinals'],
['1.2', '1-2_hilberts_hotel.html', 'Hilbert\'s Hotel']
];

function getNum(pgName) {
	var raw_num = pgName.split('_')[0];
	return raw_num.replace(/-/gi, '.');
}

function getNumList(pgNum) {
	var nums = pgNum.split('.');
	var nList = [nums[0]];
	for (var i = 1; i < nums.length; i++) {
		var num = nums[0];
		for (var j = 1; j <= i; j++) {
			num = num + '.' + nums[j];
		}
		nList.push(num);
	}
	return nList;
}

// check if first (num) is parent of second (num)
function isParent(first, second) {
	var firstList = (first == '')?[]:first.split('.');
	var secondList = second.split('.');
	secondList.splice(firstList.length);
	console.log(firstList);
	console.log(secondList);
	return (firstList.join('.') == secondList.join('.'));
}

// return ul containing contents
function getContents(pgIndex) {
	var contents = document.createElement('ul');
	var pgNum = pageList[pgIndex][0];
	
	var itemIndex = pgIndex + 1;
	var itemNum = pageList[itemIndex][0];
	while (itemIndex < pageList.length && isParent(pgNum, itemNum)) {
		itemNum = pageList[itemIndex][0];
		
		var item = document.createElement('li');
		var itemLink = document.createElement('a');
		itemLink.setAttribute('href', pageList[itemIndex][1]);
		itemLink.innerHTML = itemNum + '. ' + pageList[itemIndex][2];
		item.appendChild(itemLink);
		contents.appendChild(item);
		
		// append nested contents if needed
		// if item isnt last item, then it might be a parent
		if (itemIndex < pageList.length - 1) { 
			var nextItemIndex = itemIndex + 1;
			var nextItemNum = pageList[nextItemIndex][0];
			if (isParent(itemNum, nextItemNum)) {
				nestedContents = getContents(itemIndex);
				contents.appendChild(nestedContents);
				itemIndex += nestedContents.childElementCount;
			}
		}
		
		itemIndex++;
	}
	
	return contents;
}

var pageName = window.location.pathname.split('/').pop();
if (pageName == '') {
	pageName = 'index.html'
} else if (!pageName.includes('.')) {
	pageName += '.html'
}
var pageIndex = pageList.findIndex(el => el[1] == pageName);

var pageNum = 'temp';
var pageTitle = 'temp';

if (pageIndex != -1) {
	pageNum = pageList[pageIndex][0];
	pageTitle = pageList[pageIndex][2];
}
var numList = getNumList(pageNum);

if (pageIndex != 0) {
	
// set title of tab
document.title = pageNum + '. ' + pageTitle;

// set the breadcrumbs
var breadcrumbsList = document.getElementsByClassName("breadcrumbs");
for (var br = 0; br < breadcrumbsList.length; br++) {
	var breadcrumbs = breadcrumbsList.item(br);
	for (var i = 0; i < numList.length - 1; i++) {
		var parentNum = numList[i];
		var parentIndex = pageList.findIndex(el => el[0] == parentNum);
		var parentPageName = pageList[parentIndex][1];
		var parentLink = document.createElement('a');
		parentLink.setAttribute('href', parentPageName);
		parentLink.appendChild(document.createTextNode(parentNum));
		breadcrumbs.appendChild(parentLink);
		breadcrumbs.appendChild(document.createTextNode(' > '));
	}
	breadcrumbs.appendChild(document.createTextNode(pageNum));
}

// set the prev/next links
if (pageIndex != -1) {
	if (pageIndex > 0) {
		var prevList = document.getElementsByClassName("prev");
		for (var i = 0; i < prevList.length; i++) {
			var prev = prevList.item(i).firstElementChild;
			prev.setAttribute('href', pageList[pageIndex - 1][1]);
		}
	}
	if (pageIndex < pageList.length - 1) {		
		var nextList = document.getElementsByClassName("next");
		for (var i = 0; i < nextList.length; i++) {
			var next = nextList.item(i).firstElementChild;
			next.setAttribute('href', pageList[pageIndex + 1][1]);
		}
	}
}

// set the number/name
var bigNum = document.getElementById('page-num');
bigNum.innerHTML = pageNum;
var title = bigNum.parentNode;
title.insertBefore(document.createTextNode(pageTitle), null);

}

// set contents
var contentsList = document.getElementsByClassName("contents");
for (var i = 0; i < contentsList.length; i++) {
	contentsList.item(i).appendChild(getContents(pageIndex));
}