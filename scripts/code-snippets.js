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

function showCode(language) {
    const codeSnippetDisplay = document.getElementById("code-snippet-display");
    codeSnippetDisplay.textContent = bubbleSortCodeSnippets[language];
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