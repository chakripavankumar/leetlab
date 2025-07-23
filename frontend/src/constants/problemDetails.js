export const TAG_OPTIONS = [
  'Array',
  'String',
  'Hash Table',
  'Dynamic Programming',
  'Math',
  'Sorting',
  'Greedy',
  'Depth-First Search',
  'Binary Search',
  'Tree',
  'Breadth-First Search',
  'Two Pointers',
  'Stack',
  'Design',
  'Heap',
  'Graph',
  'Sliding Window',
  'Backtracking',
];

export const COMPANIES_NAME = [
  'Google',
  'Amazon',
  'Microsoft',
  'Apple',
  'Facebook',
  'Netflix',
  'Uber',
  'LinkedIn',
  'Twitter',
  'Airbnb',
  'Adobe',
  'Tesla',
  'Spotify',
  'Dropbox',
  'Salesforce',
  'Oracle',
  'IBM',
  'Intel',
  'NVIDIA',
  'PayPal',
];

export const SUPPORTED_LANGUAGES = [
  { id: 102, name: 'JavaScript', value: 'JAVASCRIPT' },
  { id: 109, name: 'Python', value: 'PYTHON' },
  { id: 91, name: 'Java', value: 'JAVA' },
  // { id: 2, name: 'C++', value: 'cpp' },
  // { id: 5, name: 'C', value: 'c' },
  // { id: 6, name: 'C#', value: 'csharp' },
  // { id: 7, name: 'Go', value: 'go' },
  // { id: 8, name: 'Ruby', value: 'ruby' },
  // { id: 9, name: 'Rust', value: 'rust' },
  // { id: 10, name: 'SQL', value: 'sql' },
  // { id: 11, name: 'Swift', value: 'swift' },
  // { id: 12, name: 'Kotlin', value: 'kotlin' },
  // { id: 13, name: 'TypeScript', value: 'typescript' },
];

export const DEFAULT_PROBLEM_VALUES = {
  testcases: [
    { input: '', output: '' },
    { input: '', output: '' },
  ],
  examples: [
    { input: '', output: '', explanation: '' },
    { input: '', output: '', explanation: '' },
  ],
  codeSnippets: {
    JAVASCRIPT: `
// Write your code here
function houseRobber(nums) {
  // your logic here
}

// Do not remove the below lines
const input = require('fs').readFileSync(0, 'utf-8').trim();
const nums = JSON.parse(input);
console.log(houseRobber(nums));`,
    PYTHON: `
# Write your code here
def houseRobber(nums):
  # your logic here
  pass

# Do not remove the below lines
import sys, json
nums = json.loads(sys.stdin.read().strip())
print(houseRobber(nums))`,
    JAVA: `
// Write your code here
import java.util.*;

public class Solution {
  public static int houseRobber(int[] nums) {
    // your logic here
    return 0;
  }

  // Do not remove the below main method
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String line = sc.nextLine();
    line = line.substring(1, line.length() - 1);
    String[] parts = line.split(",");
    int[] nums = new int[parts.length];
    for (int i = 0; i < parts.length; i++) {
      nums[i] = Integer.parseInt(parts[i].trim());
    }

    int result = houseRobber(nums);
    System.out.println(result);
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: '// Add your reference solution here',
    PYTHON: '# Add your reference solution here',
    JAVA: '// Add your reference solution here',
  },
};
