/* Shared question bank + analysis + storage (used by dashboard.js and test.js).
   Add a question:  ["Topic", "Question text", "optA|optB|optC|optD", correctIndex]  into a subject's q:[] list. */
const APA = (() => {
  const C = [
    ["Variables","Which is a valid variable name in C?","2count|_count|count-1|int",1],
    ["Variables","Which keyword declares a constant?","static|const|fixed|final",1],
    ["Variables","A variable declared inside a function is…","Global|Local|External|Volatile",1],
    ["Data Types","Size of int on most modern systems?","1 byte|2 bytes|4 bytes|8 bytes",2],
    ["Data Types","Which type stores a single character?","char|string|str|text",0],
    ["Data Types","Which format specifier prints a float?","%d|%c|%f|%s",2],
    ["Operators","Value of 7 % 3?","2|1|0|3",1],
    ["Operators","Which is the logical AND operator?","&|&&|and|AND",1],
    ["Operators","Result of 5/2 when both operands are int?","2.5|2|3|2.0",1],
    ["if/else","Which block runs when the if condition is false?","else|elif|then|case",0],
    ["if/else","In C, a condition is false when it equals…","1|0|-1|any letter",1],
    ["if/else","Which is correct syntax?","if x>5 {}|if (x>5) {}|if x>5 then|if [x>5]",1],
    ["switch","Which keyword exits a switch case?","stop|exit|break|skip",2],
    ["switch","The default case runs when…","Always|No case matches|Only the first case fails|Never",1],
    ["switch","A switch expression must evaluate to…","float|integer or char|string|array",1],
    ["for loop","In for(i=0;i<5;i++), how many times does the body run?","4|5|6|Infinite",1],
    ["for loop","Which part of a for loop runs only once?","Condition|Initialization|Update|Body",1],
    ["for loop","for(;;) creates…","A syntax error|An infinite loop|A loop that runs once|No loop",1],
    ["while loop","A while loop checks its condition…","After the body|Before the body|Never|Only once",1],
    ["while loop","while(0) executes the body…","Once|Never|Forever|Twice",1],
    ["while loop","Which creates an infinite loop?","while(1)|while(0)|while(!1)|while(-0)",0],
    ["do-while","Which loop runs at least once?","for|while|do-while|if",2],
    ["do-while","A do-while statement ends with…","Nothing|A semicolon after the condition|A colon|A comma",1],
    ["do-while","do{...}while(0); runs the body…","0 times|1 time|Infinitely|Gives an error",1],
    ["Arrays","Array indexing in C starts at…","1|0|-1|Any number",1],
    ["Arrays","For int a[5], the last valid index is…","5|4|6|3",1],
    ["Arrays","Declare an array of 10 ints:","int a(10);|int a[10];|array a[10];|int[10] a;",1],
    ["Strings","A C string ends with…","newline|null character|space|EOF",1],
    ["Strings","Which header declares strlen()?","stdio.h|string.h|stdlib.h|math.h",1],
    ["Strings","Which function copies a string?","strcpy|strcmp|strlen|strcat",0],
    ["Functions","Return type of a function returning nothing?","null|void|int|none",1],
    ["Functions","Arguments passed by value are…","Shared with the caller|Copied|Global|Pointers",1],
    ["Functions","A function that calls itself uses…","Overloading|Recursion|Macros|Casting",1],
    ["Pointers","Which operator gives the address of x?","*|&|#|@",1],
    ["Pointers","Which operator dereferences a pointer?","&|*|->|%",1],
    ["Pointers","int *p; means p stores…","An int|The address of an int|A char|A function",1],
    ["Pointers","An uninitialised pointer is called a…","Null pointer|Wild pointer|Void pointer|Safe pointer",1],
    ["Structures","Keyword to define a structure:","class|struct|record|object",1],
    ["Structures","Access member x of struct variable s:","s->x|s.x|s::x|s#x",1],
    ["Structures","Access member x through pointer p:","p.x|p->x|p::x|*x",1],
  ];
  const PY = [
    ["Variables","Which is a valid variable name?","1var|my_var|my-var|class",1],["Variables","Python variables are…","Statically typed|Dynamically typed|Always constant|Declared with a type",1],["Variables","x = y = 5 does what?","Error|Assigns 5 to both|Assigns 5 to x only|Compares x and y",1],
    ["Data Types","Type of 3.14?","int|float|str|double",1],["Data Types","type(True) is…","int|bool|str|float",1],["Data Types","Which is immutable?","list|dict|str|set",2],
    ["Operators","5 // 2 gives…","2.5|2|3|2.0",1],["Operators","2 ** 3 gives…","6|8|5|9",1],["Operators","Which checks equality?","=|==|:=|!",1],
    ["if/else","Keyword for else-if?","elseif|elif|else if|elsif",1],["if/else","Blocks in Python are defined by…","Braces|Indentation|Parentheses|Semicolons",1],["if/else","if 0: is treated as…","True|False|Error|None only",1],
    ["for loop","range(3) yields…","1,2,3|0,1,2|0,1,2,3|1,2",1],["for loop","for x in 'ab' iterates over…","Characters|Words|Bytes|Nothing",0],["for loop","Which skips to the next iteration?","break|continue|pass|next",1],
    ["while loop","Stop a while loop early with…","stop|break|exit|end",1],["while loop","while True: runs…","Once|Forever unless break|Never|Twice",1],["while loop","A loop's else block runs when…","The loop breaks|The loop ends normally|Always|Never",1],
    ["Lists","Add an item at the end:","add()|append()|push()|insert_end()",1],["Lists","[1,2,3][-1] is…","1|3|2|Error",1],["Lists","len([1,2,3]) is…","2|3|4|1",1],["Lists","[1,2,3,4][1:3] gives…","[1,2]|[2,3]|[2,3,4]|[1,2,3]",1],
    ["Tuples","Tuples are…","Mutable|Immutable|Unordered|Key-value",1],["Tuples","Tuple syntax:","[1,2]|(1,2)|{1,2}|<1,2>",1],["Tuples","A single-item tuple:","(1)|(1,)|[1,]|{1,}",1],
    ["Dictionaries","A dictionary stores…","Key-value pairs|Only values|Only keys|Indexes",0],["Dictionaries","Get a value safely:","d.get(k)|d.find(k)|d.read(k)|d.at(k)",0],["Dictionaries","Dictionary literal uses…","[]|()|{}|<>",2],["Dictionaries","d.keys() returns…","Values|Keys|Items|Length",1],
    ["Sets","Sets contain…","Duplicates|Unique items|Only numbers|Key-value pairs",1],["Sets","Create an empty set:","{}|set()|[]|()",1],["Sets","{1,2} | {2,3} gives…","{2}|{1,2,3}|{1,3}|{}",1],
    ["Functions","Keyword to define a function:","func|def|function|fn",1],["Functions","Return a value with…","give|return|out|send",1],["Functions","Default argument syntax:","def f(a=1)|def f(a:1)|def f(=a)|def f(a->1)",0],["Functions","*args collects…","Keyword args|Extra positional args|Nothing|A dict",1],
    ["OOP","Constructor method:","__init__|__new_obj__|init|constructor",0],["OOP","First parameter of an instance method:","this|self|cls|me",1],["OOP","Inheritance syntax:","class B(A):|class B extends A|class B:A|class B inherits A",0],["OOP","Keyword to create a class:","object|class|struct|def",1],
  ];
  const JV = [
    ["Variables","Which declares an int?","int x = 5;|x int = 5;|integer x = 5;|var int x;",0],["Variables","Constant keyword:","const|final|static|fixed",1],["Variables","Variables inside methods are…","Instance|Local|Static|Global",1],
    ["Data Types","Size of int in Java?","2 bytes|4 bytes|8 bytes|Platform dependent",1],["Data Types","Which is not primitive?","int|boolean|String|char",2],["Data Types","Default value of a boolean field?","true|false|null|0",1],
    ["Operators","10 % 3 =","1|3|0|10",0],["Operators","&& is…","Bitwise AND|Logical AND|Assignment|Comparison",1],["Operators","i++ means…","Decrement|Increment|Square|Compare",1],
    ["Conditions","Which switch label handles other cases?","else|default|other|rest",1],["Conditions","The condition in an if must be…","int|boolean|String|char",1],["Conditions","Ternary operator:","?:|??|::|=>",0],
    ["Loops","Loop that checks after the body:","for|while|do-while|for-each",2],["Loops","For-each syntax uses…","in|:|of|=>",1],["Loops","Exit a loop with…","stop|break|exit|end",1],["Loops","continue does…","Exits the loop|Skips to the next iteration|Restarts the program|Nothing",1],
    ["Arrays","Array length property:","size()|length|count|len",1],["Arrays","Declare an int array of 5:","int a[5];|int[] a = new int[5];|array a = 5;|int a = [5];",1],["Arrays","Array index starts at…","1|0|-1|2",1],["Arrays","An invalid index throws…","Compile error|ArrayIndexOutOfBoundsException|Returns 0|Null",1],
    ["Strings","Strings are…","Mutable|Immutable|Primitive|Int arrays",1],["Strings","Compare string contents with…","==|equals()|=|compare",1],["Strings","Length of string s:","s.length|s.length()|s.size()|len(s)",1],
    ["Methods","A method returning nothing uses…","null|void|none|empty",1],["Methods","Program entry point:","public static void main|void main|static main|int main",0],["Methods","Overloading means…","Same name, different parameters|Same signature in subclass|Different class|Private methods",0],
    ["Classes","Keyword to define a class:","class|struct|def|object",0],["Classes","A constructor's name equals…","init|The class name|new|main",1],["Classes","Visible everywhere:","private|protected|public|default",2],["Classes","Members that belong to the class itself use…","final|static|this|abstract",1],
    ["Objects","Create an object:","Dog d = new Dog();|Dog d = Dog();|new Dog d;|Dog d = create Dog;",0],["Objects","this refers to…","The parent class|The current object|A static class|The package",1],["Objects","An unset object reference is…","0|null|empty|undefined",1],
    ["Inheritance","Keyword for inheriting a class:","implements|extends|inherits|super",1],["Inheritance","Call the parent constructor:","parent()|super()|base()|this()",1],["Inheritance","Multiple inheritance of classes is…","Allowed|Not allowed|Only abstract|Only final",1],["Inheritance","A class that cannot be extended:","static|final|abstract|private",1],
    ["Polymorphism","Method overriding happens in…","The same class|A subclass|Interfaces only|Static blocks",1],["Polymorphism","Runtime polymorphism uses…","Overloading|Overriding|Constructors|Static methods",1],["Polymorphism","Annotation for overriding:","@Override|@Overload|@Super|@Inherit",0],
  ];
  const DS = [
    ["Arrays","Access time of an array element by index?","O(n)|O(1)|O(log n)|O(n²)",1],["Arrays","Arrays store elements…","Randomly|Contiguously|In a tree|In a hash",1],["Arrays","Inserting in the middle costs…","O(1)|O(n)|O(log n)|O(0)",1],["Arrays","Array size is typically…","Fixed|Always growing|Zero|Random",0],
    ["Linked Lists","Each node holds data and…","An index|A pointer to next|A key|A hash",1],["Linked Lists","Access the nth element costs…","O(1)|O(n)|O(log n)|O(n²)",1],["Linked Lists","Insert at head costs…","O(1)|O(n)|O(log n)|O(n²)",0],["Linked Lists","The last node's next is…","Head|NULL|Itself|Random",1],
    ["Stack","A stack follows…","FIFO|LIFO|Random|Priority",1],["Stack","The insert operation:","enqueue|push|add_front|put",1],["Stack","A stack is used for…","Undo operations|Print queues|BFS|Scheduling",0],["Stack","Read the top without removing it:","pop|peek|push|clear",1],["Stack","Stack overflow occurs when…","Stack is empty|Push on a full stack|Pop on empty|Queue is full",1],
    ["Queue","A queue follows…","LIFO|FIFO|Random|Sorted",1],["Queue","Remove from a queue:","pop|dequeue|peek|push",1],["Queue","BFS uses a…","Stack|Queue|Heap|Tree",1],["Queue","A circular queue avoids…","Overflow|Wasted space|Recursion|Sorting",1],
    ["Trees","The top node is the…","Leaf|Root|Child|Edge",1],["Trees","A binary tree node has at most…","1 child|2 children|3 children|n children",1],["Trees","In-order traversal of a BST gives…","Random order|Sorted order|Reverse order|Level order",1],["Trees","A node with no children:","Root|Leaf|Parent|Branch",1],["Trees","Height of a single-node tree (in edges)?","1|0|2|-1",1],
    ["Graphs","A graph consists of…","Keys and values|Vertices and edges|Rows and columns|Nodes only",1],["Graphs","DFS uses…","Queue|Stack|Array|Heap",1],["Graphs","An edge with a direction is…","Undirected|Directed|Weighted only|A loop",1],["Graphs","Adjacency matrix space:","O(V)|O(V²)|O(E)|O(1)",1],["Graphs","BFS on an unweighted graph finds…","Longest path|Shortest path|Cycles only|MST",1],
    ["Searching","Binary search needs…","Unsorted data|Sorted data|A linked list|A hash",1],["Searching","Binary search complexity:","O(n)|O(log n)|O(1)|O(n²)",1],["Searching","Linear search worst case:","O(1)|O(n)|O(log n)|O(n log n)",1],["Searching","Binary search halves the…","Data|Search range|Key|Index",1],
    ["Sorting","Average complexity of merge sort:","O(n²)|O(n log n)|O(n)|O(log n)",1],["Sorting","Bubble sort worst case:","O(n)|O(n²)|O(log n)|O(1)",1],["Sorting","A stable sort:","Quick sort|Merge sort|Heap sort|Selection sort",1],["Sorting","Which uses a pivot?","Merge sort|Quick sort|Bubble sort|Insertion sort",1],["Sorting","Insertion sort best case:","O(n²)|O(n)|O(log n)|O(1)",1],
    ["Hashing","A hash function maps keys to…","Strings|Indexes|Trees|Nodes",1],["Hashing","Two keys at the same index is a…","Collision|Overflow|Underflow|Cycle",0],["Hashing","Chaining resolves collisions with…","Arrays|Linked lists|Stacks|Trees only",1],["Hashing","Ideal hash lookup time:","O(n)|O(1)|O(log n)|O(n²)",1],
  ];
  const mk = (topics, q = []) => ({ topics, q: q.map(([t, text, o, a]) => ({ t, q: text, o: o.split("|"), a })) });
  const bank = {
    "C Programming": mk(["Variables","Data Types","Operators","if/else","switch","for loop","while loop","do-while","Arrays","Strings","Functions","Pointers","Structures"], C),
    "Python": mk(["Variables","Data Types","Operators","if/else","for loop","while loop","Lists","Tuples","Dictionaries","Sets","Functions","OOP"], PY),
    "Java": mk(["Variables","Data Types","Operators","Conditions","Loops","Arrays","Strings","Methods","Classes","Objects","Inheritance","Polymorphism"], JV),
    "Data Structures": mk(["Arrays","Linked Lists","Stack","Queue","Trees","Graphs","Searching","Sorting","Hashing"], DS),
    "Database Management System": mk(["SQL Basics","Joins","Normalization","Transactions","Keys"]),
    "Computer Networks": mk(["OSI Model","IP Addressing","Routing","TCP/UDP"]),
    "Operating Systems": mk(["Processes","Scheduling","Memory","Deadlocks"]),
    "Artificial Intelligence": mk(["Search","Machine Learning","Knowledge Representation"]),
    "HTML & CSS": mk(["HTML Tags","Forms","CSS Selectors","Flexbox"]),
    "JavaScript": mk(["Variables","Functions","DOM","Arrays"]),
  };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const email = () => { try { return sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail") || ""; } catch (_) { return ""; } };
  const key = () => "apa:" + email();
  const status = (p) => (p > 85 ? "Strong" : p > 70 ? "Good" : p >= 50 ? "Needs Improvement" : "Weak");
  const pill = (p) => (p < 50 ? "HIGH" : p <= 70 ? "MEDIUM" : "LOW");
  const level = (p) => (p >= 90 ? "Excellent" : p >= 80 ? "Very Good" : p >= 70 ? "Good" : p >= 50 ? "Needs Improvement" : "Critical Improvement Required");

  /* student answers -> topic scores -> weak/strong topics -> recommendations */
  function analyse(subject, qs, ans, type) {
    const stat = {}; let correct = 0, wrong = 0, unanswered = 0;
    qs.forEach((q, i) => {
      const s = (stat[q.t] = stat[q.t] || [0, 0]); s[1]++;
      if (ans[i] < 0) unanswered++; else if (ans[i] === q.a) { correct++; s[0]++; } else wrong++;
    });
    const topics = {};
    Object.keys(stat).forEach((t) => (topics[t] = Math.round((stat[t][0] / stat[t][1]) * 100)));
    const sorted = Object.entries(topics).sort((a, b) => a[1] - b[1]);
    const weakTopics = sorted.filter(([, p]) => p <= 70).map(([t]) => t);
    const strongTopics = sorted.filter(([, p]) => p > 70).map(([t]) => t).reverse();
    const percentage = Math.round((correct / qs.length) * 1000) / 10;
    const recommendations = [];
    weakTopics.slice(0, 3).forEach((t) => recommendations.push(`Revise ${t}`, `Practice 10 ${t} MCQs`));
    recommendations.push(weakTopics.length ? "Take another test after revision" : "Strong across all topics — try another subject next");
    const list = (a) => a.slice(0, 2).join(" and ");
    const insight = `Your ${subject} score is ${percentage}%. ` + (strongTopics.length ? `You performed strongly in ${list(strongTopics)}` : "No topic is above 70% yet")
      + (weakTopics.length ? `, but ${list(weakTopics)} need${weakTopics.length > 1 ? "" : "s"} more attention. Focus on ${weakTopics.length > 1 ? "these topics" : "this topic"} before taking your next test.` : ". Keep practicing to stay sharp.");
    return { type, subject, date: new Date().toISOString(), total: qs.length, correct, wrong, unanswered, percentage, performance: level(percentage),
      topics, topicStats: stat, weakTopics, strongTopics, recommendations, insight };
  }
  return {
    bank, status, pill, level, analyse,
    ready: (s) => !!(bank[s] && bank[s].q.length),
    questions: (s, n) => shuffle(bank[s].q).slice(0, n),
    load() { try { return JSON.parse(localStorage.getItem(key())) || []; } catch (_) { return []; } },
    save(r) { const a = this.load(); a.unshift(r); try { localStorage.setItem(key(), JSON.stringify(a.slice(0, 100))); } catch (_) {} },
  };
})();