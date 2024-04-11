/*
COMP 2406 Final Term Project
By Ibraheem Refai
101259968
April 10, 2024
*/

//Some of the setup code in this file is taken from the openai documentation website or slightly modified from it
//Source Cited: https://platform.openai.com/docs/api-reference/introduction

//Open AI API key - Don't steal this please );
const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY || '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'

const express = require('express')
const router = express.Router()

//Requiring neccessary npm openai modules
const { Configuration, OpenAIApi } = require("openai")
const { OpenAI } = require('openai')


//Dictionary to store the courses aloing with a brief description of them
//Will store in the database in the future
courseDescriptions = {
"COMP 1405": "Introduction to computer science and programming, for computer science students. Topics include: algorithm design; control structures; variables and types; linear collections; functions; debugging and testing. Special attention is given to procedural programming in a modern language, computational thinking skills, and problem decomposition.",

"COMP 1406": " A second course in programming for BCS students, emphasizing problem solving and computational thinking in an object-oriented language. Topics include abstraction, mutable data structures, methods, inheritance, polymorphism, recursion, program efficiency, testing and debugging.",

"COMP 1805": "Introduction to discrete mathematics and discrete structures. Topics include: propositional logic, predicate calculus, set theory, complexity of algorithms, mathematical reasoning and proof techniques, recurrences, induction, finite automata and graph theory. Material is illustrated through examples from computing.",

"COMP 2401": "Introduction to system-level programming with fundamental OS concepts, procedures, primitive data types, user-defined types. Topics may include process management, memory management, process coordination and synchronization, inter-process communication, file systems, networking, pointers, heap and stack memory management, and system/library calls.",

"SYSC 2004": "Designing and implementing small-scale programs as communities of collaborating objects, using a dynamically-typed or statically-typed programming language. Fundamental concepts: classes, objects, encapsulation, information hiding, inheritance, polymorphism. Iterative, incremental development and test-driven development.",

"SYSC 2006": "The imperative programming paradigm: assignment and state, types and variables, static and dynamic typing. Memory management and object lifetimes: static allocation, automatic allocation in activation frames, dynamic allocation. Function argument passing. Recursion. Data structures: dynamic arrays, linked lists. Encapsulation and information hiding.",

"SYSC 2100": "Thorough coverage of fundamental abstract collections: stacks, queues, lists, priority queues, dictionaries, sets, graphs. Data structures: review of arrays and linked lists; trees, heaps, hash tables. Specification, design, implementation of collections, complexity analysis of operations. Sorting algorithms.",

"SYSC 2310": "Number systems: binary, decimal, hexadecimal. Digital representation of information. Computer arithmetic: integer, floating point, fixed point. Boolean logic, realization as basic digital circuits. Applications: simple memory circuits, synchronous sequential circuits for computer systems. Finite state machines, state graphs, counters, adders. Asynchronous sequential circuits. Races.",

"NET 2000": "Architecture, components and operations of routers and switches in Enterprise networks. Topics include configuration and troubleshooting of OSPF, including Multi-area, redundancy, NAT and troubleshooting techniques.",

"NET 2008": "Exposure to unifying software development (Dev) and software operation (Ops). Use of Python to monitor and automate network management tasks.",

"NET 2011": "Using Unix and Linux Operating systems, study of the command line and network Server operating environments. Configuring Services and Protocols such as DNS, NTP, SSH, SMB, SMTP, POP3, IMAP, HTTP, and DHCP. Basic Server security using firewalls is also introduced.",

"NET 2012": "Enterprise technologies and QoS mechanisms used for networks access. Topics include virtualization, and automation concepts. Software-defined networking, controller-based architectures and how application programming interfaces (APIs) enable network automation."
}


//We will store the conversation history so that the GPT model can reference previous messages sent by itself or the user
let chatConversationHistory = ''

//Setup OpenAI API
const open_ai_api = new OpenAI({ apiKey: OPEN_AI_API_KEY })

//This function generates the course details for the prompt.
function generateCourseDetails(courses) {
    return courses.map(course => `${course}: ${courseDescriptions[course] || 'No description available.'}`).join("\n\n");
}
  

router.post('/chatWithBot', async function(request, response) {
    const { userMessage } = request.body
    const { courses, interests, major, language } = request.session.userData
  
    const courseDetails = generateCourseDetails(courses)

    //This is the prompt we construct to send to the openai api
    let prompt = `You are an expert AI assistant and tutor specialized in helping students with their courses, and anything else they need help with.
    You will be given data on them and will have to use this data to fulfill all their requests and help them with whatever issues they are having or whatever they want to chat about.
    The user is taking the following courses: ${courseDetails}.
    The user is interested in: ${interests.join(", ")}.
    The user is studying: ${major}.
    Other than English, the strongest language the user speaks is: ${language}.
    The following is a conversation with the user. Respond to their inquiries as helpfully as possible:
    User: ${userMessage}
    AI:`


    try{
        const APIResponse = await open_ai_api.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 150,
            stop: ["\n", "User:", "Bot:"],
        })

        const responseMessage = APIResponse.choices[0]
        chatConversationHistory += `User: ${userMessage}\nAI: ${responseMessage}\n`

        //Sending back the AI's response to the client
        response.json({ message: responseMessage })
  } 
  catch (error) 
  {
    console.error("Error with OpenAI API! ", error)
    response.status(500).send("Something went wrong! ): Error processing your chat interaction.")
  }
})


module.exports = router
