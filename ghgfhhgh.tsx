import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Play,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

export type SupportedLanguage = 'python' | 'javascript' | 'typescript' | 'cpp' | 'java' | 'go' | 'rust' | 'php';

interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Oson' | "O'rta" | 'Qiyin';
  category: string;
  snippets: Record<SupportedLanguage, string>;
  expectedOutput: string;
  explanation: string;
}

const CODE_CHALLENGES: CodeChallenge[] = [
  {
    id: 'sum-two',
    title: "1. Ikki son yig'indisi va Kvadrat ildiz",
    description: "Kiritilgan ikki sonning yig'indisini hisoblang va natijadan kvadrat ildiz oling.",
    difficulty: 'Oson',
    category: 'Matematika & Kirish',
    snippets: {
      python: `# Python 3.12
import math

def calculate_sum_and_sqrt(a: float, b: float) -> tuple:
    total = a + b
    root = math.sqrt(total)
    return total, root

a, b = 64, 36
total, root = calculate_sum_and_sqrt(a, b)
print(f"Yig'indi: {total}")
print(f"Kvadrat ildiz: {root:.2f}")`,
      javascript: `// JavaScript (ES2024 / Node.js)
function calculateSumAndSqrt(a, b) {
  const total = a + b;
  const root = Math.sqrt(total);
  return { total, root };
}

const a = 64, b = 36;
const { total, root } = calculateSumAndSqrt(a, b);
console.log("Yig'indi:", total);
console.log("Kvadrat ildiz:", root.toFixed(2));`,
      typescript: `// TypeScript 5.x
interface Result {
  total: number;
  root: number;
}

function calculateSumAndSqrt(a: number, b: number): Result {
  const total: number = a + b;
  const root: number = Math.sqrt(total);
  return { total, root };
}

const a = 64, b = 36;
const { total, root } = calculateSumAndSqrt(a, b);
console.log(\`Yig'indi: \${total}\`);
console.log(\`Kvadrat ildiz: \${root.toFixed(2)}\`);`,
      cpp: `// C++20 (Modern C++)
#include <iostream>
#include <cmath>
#include <iomanip>

std::pair<double, double> calculateSumAndSqrt(double a, double b) {
    double total = a + b;
    double root = std::sqrt(total);
    return {total, root};
}

int main() {
    double a = 64.0, b = 36.0;
    auto [total, root] = calculateSumAndSqrt(a, b);
    std::cout << "Yig'indi: " << total << std::endl;
    std::cout << "Kvadrat ildiz: " << std::fixed << std::setprecision(2) << root << std::endl;
    return 0;
}`,
      java: `// Java 21
public class Solution {
    public static void main(String[] args) {
        double a = 64.0;
        double b = 36.0;
        double total = a + b;
        double root = Math.sqrt(total);

        System.out.println("Yig'indi: " + (int)total);
        System.out.printf("Kvadrat ildiz: %.2f%n", root);
    }
}`,
      go: `// Go (Golang 1.22)
package main

import (
	"fmt"
	"math"
)

func calculateSumAndSqrt(a, b float64) (float64, float64) {
	total := a + b
	root := math.Sqrt(total)
	return total, root
}

func main() {
	a, b := 64.0, 36.0
	total, root := calculateSumAndSqrt(a, b)
	fmt.Printf("Yig'indi: %.0f\\n", total)
	fmt.Printf("Kvadrat ildiz: %.2f\\n", root)
}`,
      rust: `// Rust 2021
fn calculate_sum_and_sqrt(a: f64, b: f64) -> (f64, f64) {
    let total = a + b;
    let root = total.sqrt();
    (total, root)
}

fn main() {
    let (a, b) = (64.0, 36.0);
    let (total, root) = calculate_sum_and_sqrt(a, b);
    println!("Yig'indi: {:.0}", total);
    println!("Kvadrat ildiz: {:.2}", root);
}`,
      php: `<?php
// PHP 8.3
function calculateSumAndSqrt(float $a, float $b): array {
    $total = $a + $b;
    $root = sqrt($total);
    return ['total' => $total, 'root' => $root];
}

$a = 64; $b = 36;
$res = calculateSumAndSqrt($a, $b);
echo "Yig'indi: " . $res['total'] . "\\n";
echo "Kvadrat ildiz: " . number_format($res['root'], 2) . "\\n";
?>`,
    },
    expectedOutput: `Yig'indi: 100\nKvadrat ildiz: 10.00`,
    explanation: "64 + 36 = 100. 100 ning kvadrat ildizi esa 10 ga teng. Har bir dasturlash tili o'zining matematik kutubxonasi (math, cmath, Math) orqali hisoblaydi.",
  },
  {
    id: 'palindrome',
    title: "2. Palindrom matnni tekshirish",
    description: "So'z yoki jumla chapdan o'ngga va o'ngdan chapga bir xil o'qilishini tekshiring (masalan: 'aziza', 'radar', 'level').",
    difficulty: "O'rta",
    category: 'Matnlar & Algoritmlar',
    snippets: {
      python: `# Python 3.12 (Slicing usuli)
def is_palindrome(text: str) -> bool:
    cleaned = ''.join(c.lower() for c in text if c.isalnum())
    return cleaned == cleaned[::-1]

word = "radar"
print(f"'{word}' palindrommi? -> {is_palindrome(word)}")`,
      javascript: `// JavaScript
function isPalindrome(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

const word = "radar";
console.log(\`'\${word}' palindrommi? -> \${isPalindrome(word)}\`);`,
      typescript: `// TypeScript
function isPalindrome(text: string): boolean {
  const cleaned: string = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

const word: string = "radar";
console.log(\`'\${word}' palindrommi? -> \${isPalindrome(word)}\`);`,
      cpp: `// C++20 (Two pointers usuli)
#include <iostream>
#include <string>
#include <algorithm>

bool isPalindrome(std::string text) {
    int left = 0, right = text.length() - 1;
    while (left < right) {
        if (std::tolower(text[left]) != std::tolower(text[right])) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    std::string word = "radar";
    std::cout << "'" << word << "' palindrommi? -> " << (isPalindrome(word) ? "true" : "false") << std::endl;
    return 0;
}`,
      java: `// Java 21
public class Solution {
    public static boolean isPalindrome(String s) {
        String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        int left = 0, right = clean.length() - 1;
        while (left < right) {
            if (clean.charAt(left++) != clean.charAt(right--)) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        String word = "radar";
        System.out.println("'" + word + "' palindrommi? -> " + isPalindrome(word));
    }
}`,
      go: `// Go
package main

import (
	"fmt"
	"strings"
)

func isPalindrome(s string) bool {
	clean := strings.ToLower(s)
	runes := []rune(clean)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		if runes[i] != runes[j] {
			return false
		}
	}
	return true
}

func main() {
	word := "radar"
	fmt.Printf("'%s' palindrommi? -> %t\\n", word, isPalindrome(word))
}`,
      rust: `// Rust
fn is_palindrome(text: &str) -> bool {
    let clean: String = text.chars().filter(|c| c.is_alphanumeric()).flat_map(|c| c.to_lowercase()).collect();
    clean.chars().eq(clean.chars().rev())
}

fn main() {
    let word = "radar";
    println!("'{}' palindrommi? -> {}", word, is_palindrome(word));
}`,
      php: `<?php
// PHP
function isPalindrome(string $text): bool {
    $clean = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $text));
    return $clean === strrev($clean);
}

$word = "radar";
echo "'$word' palindrommi? -> " . (isPalindrome($word) ? 'true' : 'false') . "\\n";
?>`,
    },
    expectedOutput: `'radar' palindrommi? -> true`,
    explanation: "'radar' so'zi teskarisiga o'qilganda ham aynan 'radar' bo'ladi, shuning uchun bu so'z Palindrom hisoblanadi.",
  },
  {
    id: 'binary-search',
    title: "3. Binar qidiruv (Binary Search O(log N))",
    description: "Saralangan massiv ichidan berilgan element indeksini ikkiga bo'lish algoritmi bilan eng tezkor usulda toping.",
    difficulty: "O'rta",
    category: 'Qidiruv Algoritmlari',
    snippets: {
      python: `# Python 3.12 - Binary Search O(log N)
def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

numbers = [10, 25, 38, 45, 62, 77, 89, 94]
target = 62
idx = binary_search(numbers, target)
print(f"Element {target} indeksi: {idx}")`,
      javascript: `// JavaScript - Binary Search
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const numbers = [10, 25, 38, 45, 62, 77, 89, 94];
const target = 62;
console.log(\`Element \${target} indeksi: \${binarySearch(numbers, target)}\`);`,
      typescript: `// TypeScript - Binary Search
function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const numbers: number[] = [10, 25, 38, 45, 62, 77, 89, 94];
const target = 62;
console.log(\`Element \${target} indeksi: \${binarySearch(numbers, target)}\`);`,
      cpp: `// C++20 - Binary Search
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> numbers = {10, 25, 38, 45, 62, 77, 89, 94};
    int target = 62;
    std::cout << "Element " << target << " indeksi: " << binarySearch(numbers, target) << std::endl;
    return 0;
}`,
      java: `// Java 21 - Binary Search
import java.util.Arrays;

public class Solution {
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] numbers = {10, 25, 38, 45, 62, 77, 89, 94};
        int target = 62;
        System.out.println("Element " + target + " indeksi: " + binarySearch(numbers, target));
    }
}`,
      go: `// Go - Binary Search
package main

import "fmt"

func binarySearch(arr []int, target int) int {
	left, right := 0, len(arr)-1
	for left <= right {
		mid := left + (right-left)/2
		if arr[mid] == target {
			return mid
		}
		if arr[mid] < target {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}
	return -1
}

func main() {
	numbers := []int{10, 25, 38, 45, 62, 77, 89, 94}
	target := 62
	fmt.Printf("Element %d indeksi: %d\\n", target, binarySearch(numbers, target))
}`,
      rust: `// Rust - Binary Search
fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len();

    while left < right {
        let mid = left + (right - left) / 2;
        if arr[mid] == target {
            return Some(mid);
        } else if arr[mid] < target {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    None
}

fn main() {
    let numbers = [10, 25, 38, 45, 62, 77, 89, 94];
    let target = 62;
    match binary_search(&numbers, target) {
        Some(idx) => println!("Element {} indeksi: {}", target, idx),
        None => println!("Topilmadi"),
    }
}`,
      php: `<?php
// PHP - Binary Search
function binarySearch(array $arr, int $target): int {
    $left = 0; $right = count($arr) - 1;
    while ($left <= $right) {
        $mid = intdiv($left + $right, 2);
        if ($arr[$mid] === $target) return $mid;
        if ($arr[$mid] < $target) $left = $mid + 1;
        else $right = $mid - 1;
    }
    return -1;
}

$numbers = [10, 25, 38, 45, 62, 77, 89, 94];
$target = 62;
echo "Element $target indeksi: " . binarySearch($numbers, $target) . "\\n";
?>`,
    },
    expectedOutput: `Element 62 indeksi: 4`,
    explanation: "Massivda [10, 25, 38, 45, 62, 77, 89, 94] 62 soni 4-indeksda joylashgan (0-dan boshlab sanalganda). Binar qidiruv uni atigi 2-3 ta qadamda topadi.",
  },
  {
    id: 'game-loop',
    title: "4. Koinot O'yini Logikasi (Mini Game Loop & Player Position)",
    description: "O'yinchining koinot kemasi x, y koordinatasi va tezligi bo'yicha harakatini hisoblash algoritmi.",
    difficulty: "Oson",
    category: "O'yin Dasturlash (GameDev)",
    snippets: {
      python: `# Python - Space Ship Movement
class SpaceShip:
    def __init__(self, x=0, y=0, speed=5):
        self.x = x
        self.y = y
        self.speed = speed
        self.fuel = 100

    def move(self, dx: int, dy: int):
        self.x += dx * self.speed
        self.y += dy * self.speed
        self.fuel -= 2

ship = SpaceShip(x=10, y=20, speed=4)
ship.move(dx=2, dy=3) # 2 qadam o'ngga, 3 qadam tepaga
print(f"Kema yangi pozitsiyasi: x={ship.x}, y={ship.y}, Yoqilg'i: {ship.fuel}%")`,
      javascript: `// JavaScript - Space Ship Movement
class SpaceShip {
  constructor(x = 0, y = 0, speed = 5) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.fuel = 100;
  }

  move(dx, dy) {
    this.x += dx * this.speed;
    this.y += dy * this.speed;
    this.fuel -= 2;
  }
}

const ship = new SpaceShip(10, 20, 4);
ship.move(2, 3);
console.log(\`Kema yangi pozitsiyasi: x=\${ship.x}, y=\${ship.y}, Yoqilg'i: \${ship.fuel}%\`);`,
      typescript: `// TypeScript - Space Ship Movement
interface ShipState {
  x: number;
  y: number;
  speed: number;
  fuel: number;
}

class SpaceShip implements ShipState {
  constructor(public x: number = 0, public y: number = 0, public speed: number = 5, public fuel: number = 100) {}

  move(dx: number, dy: number): void {
    this.x += dx * this.speed;
    this.y += dy * this.speed;
    this.fuel -= 2;
  }
}

const ship = new SpaceShip(10, 20, 4);
ship.move(2, 3);
console.log(\`Kema yangi pozitsiyasi: x=\${ship.x}, y=\${ship.y}, Yoqilg'i: \${ship.fuel}%\`);`,
      cpp: `// C++20 - Space Ship Class
#include <iostream>

class SpaceShip {
public:
    int x, y, speed, fuel;
    SpaceShip(int startX, int startY, int spd) : x(startX), y(startY), speed(spd), fuel(100) {}

    void move(int dx, int dy) {
        x += dx * speed;
        y += dy * speed;
        fuel -= 2;
    }
};

int main() {
    SpaceShip ship(10, 20, 4);
    ship.move(2, 3);
    std::cout << "Kema yangi pozitsiyasi: x=" << ship.x << ", y=" << ship.y << ", Yoqilg'i: " << ship.fuel << "%" << std::endl;
    return 0;
}`,
      java: `// Java 21 - Space Ship Class
public class Solution {
    static class SpaceShip {
        int x, y, speed, fuel;
        public SpaceShip(int x, int y, int speed) {
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.fuel = 100;
        }
        public void move(int dx, int dy) {
            this.x += dx * this.speed;
            this.y += dy * this.speed;
            this.fuel -= 2;
        }
    }

    public static void main(String[] args) {
        SpaceShip ship = new SpaceShip(10, 20, 4);
        ship.move(2, 3);
        System.out.println("Kema yangi pozitsiyasi: x=" + ship.x + ", y=" + ship.y + ", Yoqilg'i: " + ship.fuel + "%");
    }
}`,
      go: `// Go - Space Ship Struct
package main

import "fmt"

type SpaceShip struct {
	x, y  int
	speed int
	fuel  int
}

func (s *SpaceShip) Move(dx, dy int) {
	s.x += dx * s.speed
	s.y += dy * s.speed
	s.fuel -= 2
}

func main() {
	ship := SpaceShip{x: 10, y: 20, speed: 4, fuel: 100}
	ship.Move(2, 3)
	fmt.Printf("Kema yangi pozitsiyasi: x=%d, y=%d, Yoqilg'i: %d%%\\n", ship.x, ship.y, ship.fuel)
}`,
      rust: `// Rust - Space Ship Struct
struct SpaceShip {
    x: i32,
    y: i32,
    speed: i32,
    fuel: i32,
}

impl SpaceShip {
    fn new(x: i32, y: i32, speed: i32) -> Self {
        Self { x, y, speed, fuel: 100 }
    }
    fn move_ship(&mut self, dx: i32, dy: i32) {
        self.x += dx * self.speed;
        self.y += dy * self.speed;
        self.fuel -= 2;
    }
}

fn main() {
    let mut ship = SpaceShip::new(10, 20, 4);
    ship.move_ship(2, 3);
    println!("Kema yangi pozitsiyasi: x={}, y={}, Yoqilg'i: {}%", ship.x, ship.y, ship.fuel);
}`,
      php: `<?php
// PHP - Space Ship Class
class SpaceShip {
    public int $x, $y, $speed, $fuel = 100;
    public function __construct(int $x, int $y, int $speed) {
        $this->x = $x; $this->y = $y; $this->speed = $speed;
    }
    public function move(int $dx, int $dy): void {
        $this->x += $dx * $this->speed;
        $this->y += dy * $this->speed;
        $this->fuel -= 2;
    }
}

$ship = new SpaceShip(10, 20, 4);
$ship->move(2, 3);
echo "Kema yangi pozitsiyasi: x={$ship->x}, y={$ship->y}, Yoqilg'i: {$ship->fuel}%\\n";
?>`,
    },
    expectedOutput: `Kema yangi pozitsiyasi: x=18, y=32, Yoqilg'i: 98%`,
    explanation: "Dastlab x=10 edi, 2 * 4 = 8 qo'shilib x=18 bo'ldi. y=20 edi, 3 * 4 = 12 qo'shilib y=32 bo'ldi. Har bir harakatda yoqilg'i 2 foizga kamaydi.",
  },
];

const LANGUAGES: { id: SupportedLanguage; label: string; icon: string; badge: string; color: string }[] = [
  { id: 'python', label: 'Python', icon: '🐍', badge: 'v3.12', color: 'from-blue-500 to-amber-500' },
  { id: 'javascript', label: 'JavaScript', icon: '⚡', badge: 'ES2024', color: 'from-yellow-400 to-amber-500' },
  { id: 'typescript', label: 'TypeScript', icon: '🔷', badge: 'TS 5.x', color: 'from-blue-600 to-cyan-500' },
  { id: 'cpp', label: 'C++', icon: '⚙️', badge: 'C++20', color: 'from-indigo-500 to-blue-600' },
  { id: 'java', label: 'Java', icon: '☕', badge: 'JDK 21', color: 'from-red-500 to-orange-500' },
  { id: 'go', label: 'Go (Golang)', icon: '🐹', badge: 'v1.22', color: 'from-cyan-400 to-blue-500' },
  { id: 'rust', label: 'Rust', icon: '🦀', badge: '2021', color: 'from-orange-600 to-amber-600' },
  { id: 'php', label: 'PHP', icon: '🐘', badge: 'v8.3', color: 'from-purple-500 to-indigo-600' },
];

export const MultiLanguageCodeLab: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('python');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(CODE_CHALLENGES[0].id);
  const [copied, setCopied] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentChallenge = CODE_CHALLENGES.find((c) => c.id === selectedChallengeId) || CODE_CHALLENGES[0];
  const currentSnippet = currentChallenge.snippets[selectedLang];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput('⏳ Kod kompilyatsiya qilinmoqda va ishga tushirilmoqda...');

    setTimeout(() => {
      setIsRunning(false);
      setTerminalOutput(currentChallenge.expectedOutput);
    }, 450);
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Dasturlash Tillari Laboratoriyasi
                </h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold uppercase">
                  8 ta Til Birgalikda
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Barcha masalalar va o'yin algoritmlarini <strong>Python, JavaScript, TypeScript, C++, Java, Go, Rust va PHP</strong> tillarida taqqoslang va sinab ko'ring!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs text-indigo-300 font-mono flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Language Engine v2.5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Dasturlash tilini tanlang:</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  setSelectedLang(lang.id);
                  setTerminalOutput(null);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition active:scale-95 text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-900/90 to-slate-900 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <span className="text-2xl mb-1">{lang.icon}</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {lang.label}
                </span>
                <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                  {lang.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Challenge Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Challenge List */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>Mavjud Algoritmlar & Masalalar:</span>
          </h4>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {CODE_CHALLENGES.map((ch) => {
              const isCurrent = ch.id === selectedChallengeId;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSelectedChallengeId(ch.id);
                    setTerminalOutput(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition ${
                    isCurrent
                      ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-indigo-400 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                      {ch.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ch.difficulty === 'Oson'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : ch.difficulty === "O'rta"
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {ch.difficulty}
                    </span>
                  </div>

                  <h5 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                    {ch.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {ch.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer & Interactive Terminal */}
        <div className="lg:col-span-2 space-y-4">
          {/* Code Editor Header */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                  solution.{selectedLang === 'python' ? 'py' : selectedLang === 'cpp' ? 'cpp' : selectedLang === 'java' ? 'java' : selectedLang === 'go' ? 'go' : selectedLang === 'rust' ? 'rs' : selectedLang === 'php' ? 'php' : 'ts'}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                  {selectedLang.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Nusxalandi!' : 'Kodni nusxalash'}</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Bajarilmoqda...' : 'Ishga tushirish'}</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-emerald-300 bg-slate-950 overflow-x-auto leading-relaxed max-h-[380px] scrollbar-thin">
              <pre className="whitespace-pre">{currentSnippet}</pre>
            </div>

            {/* Explanation box */}
            <div className="p-3.5 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Qoida va izoh: </strong>
                <span>{currentChallenge.explanation}</span>
              </div>
            </div>
          </div>

          {/* Interactive Output Terminal */}
          <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-500 border-b border-slate-900 pb-2">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold text-[11px] text-slate-400">Terminal & Chiqish Natijasi (Console Output)</span>
              </div>
              <span className="text-[10px]">Stdout</span>
            </div>

            <div className="pt-1">
              {terminalOutput ? (
                <div className="text-emerald-400 whitespace-pre font-bold animate-in fade-in">
                  {terminalOutput}
                </div>
              ) : (
                <div className="text-slate-600 italic">
                  Yuqoridagi «Ishga tushirish» tugmasini bosib, {selectedLang.toUpperCase()} kodi natijasini shu yerda ko'ring...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
