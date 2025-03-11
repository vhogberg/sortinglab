/* Viktor Högberg, Léo Tuomenoksa Texier */

// CODE SNIPPETS

const bubbleSortCodeSnippets = {
    javascript: `
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
            }
        }
    }
    return arr;
}
    `,
    python: `
def bubble_sort(arr):
    for i in range(len(arr) - 1):
        for j in range(len(arr) - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # Swap
    return arr
    `,
    java: `
public class BubbleSort {
    public static int[] bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;  // Swap
                }
            }
        }
        return arr;
    }
}
    `,
    cpp: `
#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);  // Swap
            }
        }
    }
}
    `
};

const insertionSortCodeSnippets = {
    javascript: `
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    return arr;
}
    `,
    python: `
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
    `,
    java: `
public class InsertionSort {
    public static int[] insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
        return arr;
    }
}
    `,
    cpp: `
#include <iostream>
using namespace std;

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
    `
};

const selectionSortCodeSnippets = {
    javascript: `
function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // Swap
    }
    return arr;
}
    `,
    python: `
def selection_sort(arr):
    for i in range(len(arr) - 1):
        min_index = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]  # Swap
    return arr
    `,
    java: `
public class SelectionSort {
    public static int[] selectionSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;  // Swap
        }
        return arr;
    }
}
    `,
    cpp: `
#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        swap(arr[i], arr[minIndex]);  // Swap
    }
}
    `
};

const mergeSortCodeSnippets = {
    javascript: `
function mergeSort(arr) {
    if (arr.length < 2) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = mergeSort(arr.slice(0, mid));
    let right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    while (left.length && right.length) {
        result.push(left[0] < right[0] ? left.shift() : right.shift());
    }
    return result.concat(left, right);
}
    `,
    python: `
def merge_sort(arr):
    if len(arr) < 2:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    while left and right:
        result.append(left.pop(0) if left[0] < right[0] else right.pop(0))
    return result + left + right
    `,
    java: `
public class MergeSort {
    public static int[] mergeSort(int[] arr) {
        if (arr.length < 2) return arr;
        int mid = arr.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
        return merge(left, right);
    }

    private static int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            result[k++] = left[i] < right[j] ? left[i++] : right[j++];
        }
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        return result;
    }
}
    `,
    cpp: `
#include <iostream>
#include <vector>
using namespace std;

vector<int> mergeSort(vector<int>& arr) {
    if (arr.size() < 2) return arr;
    int mid = arr.size() / 2;
    vector<int> left(arr.begin(), arr.begin() + mid);
    vector<int> right(arr.begin() + mid, arr.end());
    return merge(mergeSort(left), mergeSort(right));
}

vector<int> merge(vector<int> left, vector<int> right) {
    vector<int> result;
    while (!left.empty() && !right.empty()) {
        result.push_back(left.front() < right.front() ? left.front() : right.front());
        if (left.front() < right.front()) left.erase(left.begin());
        else right.erase(right.begin());
    }
    result.insert(result.end(), left.begin(), left.end());
    result.insert(result.end(), right.begin(), right.end());
    return result;
}
    `
};



function showCode(language) {
    let path = window.location.pathname;
    let page = path.split("/").pop();

    const codeSnippetDisplay = document.getElementById("code-snippet-display");
    switch (page) {
        case "bubble-sort.html":
            codeSnippetDisplay.textContent = bubbleSortCodeSnippets[language];
            break;
        case "insertion-sort.html":
            codeSnippetDisplay.textContent = insertionSortCodeSnippets[language];
            break;
        case "selection-sort.html":
            codeSnippetDisplay.textContent = selectionSortCodeSnippets[language];
            break;
        case "merge-sort.html":
            codeSnippetDisplay.textContent = mergeSortCodeSnippets[language];
            break;
    }
}

// set event listeners for radio buttons
document.addEventListener('DOMContentLoaded', () => {
    // JavaScript
    document.getElementById('code-snippet-button-javascript').addEventListener('change', () => {
        showCode('javascript');
    });

    // Python
    document.getElementById('code-snippet-button-python').addEventListener('change', () => {
        showCode('python');
    });

    // Java
    document.getElementById('code-snippet-button-java').addEventListener('change', () => {
        showCode('java');
    });

    // C++
    document.getElementById('code-snippet-button-cpp').addEventListener('change', () => {
        showCode('cpp');
    });

    // Show JavaScript code by default when the page loads
    showCode('javascript');
});