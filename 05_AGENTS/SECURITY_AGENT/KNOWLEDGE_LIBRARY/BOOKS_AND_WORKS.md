# SECURITY_AGENT — BOOKS AND WORKS

## Purpose
Canonical books, papers, guides, and standards that form the SECURITY_AGENT's reading list. All entries are real, published works with verifiable ISBNs or publication identifiers.

---

## Foundational Books

### Applied Cryptography: Protocols, Algorithms, and Source Code in C
- **Author:** Bruce Schneier
- **Publisher:** Wiley, 1st ed. 1994; 2nd ed. 1996
- **ISBN:** 978-0471117094 (2nd ed.)
- **Why it matters:** The reference book for understanding symmetric and asymmetric encryption, hash functions, digital signatures, and cryptographic protocols. Covers DES, RSA, Diffie-Hellman, and dozens of real-world protocols. Still relevant for foundational understanding despite the age of some algorithms.

### Secrets and Lies: Digital Security in a Networked World
- **Author:** Bruce Schneier
- **Publisher:** Wiley, 2000
- **ISBN:** 978-0471453802
- **Why it matters:** Shifts focus from pure cryptography to the human, organizational, and systemic dimensions of security. Argues that security is a process, not a product.

### Security Engineering: A Guide to Building Dependable Distributed Systems
- **Author:** Ross Anderson
- **Publisher:** Wiley, 3rd ed. 2020 (freely available online at cl.cam.ac.uk/~rja14/book.html)
- **ISBN:** 978-1119642787 (3rd ed.)
- **Why it matters:** Encyclopedic coverage of security engineering — cryptography, protocols, psychology of security, economics, safety-critical systems, and emerging threats. The 3rd edition (2020) covers machine learning security, IoT, and modern cloud threats.

### The Tangled Web: A Guide to Securing Modern Web Applications
- **Author:** Michal Zalewski
- **Publisher:** No Starch Press, 2011
- **ISBN:** 978-1593273880
- **Why it matters:** Deep analysis of how browsers and HTTP work, and why the same-origin policy and the web security model are fragile. Essential for understanding XSS, CSRF, clickjacking, and browser-based attacks.

### Writing Secure Code (2nd Edition)
- **Authors:** Michael Howard, David LeBlanc
- **Publisher:** Microsoft Press, 2003
- **ISBN:** 978-0735617223
- **Why it matters:** Practical guide to writing secure C/C++ code with extensive examples of common vulnerabilities (buffer overflows, integer errors, format strings) and how to prevent them. The foundation of Microsoft's SDL.

### Threat Modeling: Designing for Security
- **Author:** Adam Shostack
- **Publisher:** Wiley, 2014
- **ISBN:** 978-1118809990
- **Why it matters:** The most complete and practical guide to threat modeling. Covers STRIDE, attack trees, data flow diagrams, and how to embed threat modeling into agile development. Required reading for anyone conducting security design reviews.

### The Shellcoder's Handbook: Discovering and Exploiting Security Holes (2nd Edition)
- **Authors:** Chris Anley, John Heasman, Felix Lindner, Gerardo Richarte
- **Publisher:** Wiley, 2007
- **ISBN:** 978-0470080238
- **Why it matters:** Technical deep-dive into exploitation techniques — stack/heap overflows, format string bugs, kernel exploits, shellcode. Builds attacker-side knowledge necessary for effective defensive engineering.

### The Web Application Hacker's Handbook: Finding and Exploiting Security Flaws (2nd Edition)
- **Authors:** Dafydd Stuttard, Marcus Pinto
- **Publisher:** Wiley, 2011
- **ISBN:** 978-1118026472
- **Why it matters:** Comprehensive guide to web application penetration testing. Covers authentication testing, session management, injection, business logic flaws, and more. Complements the OWASP Testing Guide.

---

## Standards and Guides

### OWASP Top 10 (2021 Edition)
- **Publisher:** OWASP Foundation
- **URL:** https://owasp.org/Top10/
- **Why it matters:** Industry-accepted consensus list of the most critical web application security risks. Used as a baseline for security requirements in many compliance frameworks.

### OWASP Application Security Verification Standard (ASVS) 4.0
- **Publisher:** OWASP Foundation
- **URL:** https://owasp.org/www-project-application-security-verification-standard/
- **Why it matters:** Three-level verification framework (L1 opportunistic, L2 standard, L3 advanced) covering authentication, session management, access control, cryptography, error handling, data protection, and more.

### OWASP Testing Guide (v4.2)
- **Publisher:** OWASP Foundation
- **URL:** https://owasp.org/www-project-web-security-testing-guide/
- **Why it matters:** Step-by-step testing methodology for web applications. Covers information gathering, configuration testing, identity management, authentication, authorization, session management, input validation, and more.

### NIST SP 800-63B: Digital Identity Guidelines — Authentication and Lifecycle Management
- **Publisher:** NIST
- **Year:** 2017 (with subsequent updates)
- **Why it matters:** Authoritative US government guidance on password policies, authenticator assurance levels (AAL1/AAL2/AAL3), and phishing-resistant authentication. Debunked arbitrary complexity rules in favor of length and breach checking.

### NIST Cybersecurity Framework (CSF) 2.0
- **Publisher:** NIST
- **Year:** 2024
- **Why it matters:** Framework for improving cybersecurity posture: Govern, Identify, Protect, Detect, Respond, Recover. Widely adopted in enterprise security programs.

---

## Academic Papers

### "SoK: Eternal War in Memory" (IEEE S&P 2013)
- **Authors:** Laszlo Szekeres, Mathias Payer, Tao Wei, Dawn Song
- **Why it matters:** Systematic review of memory safety vulnerabilities and defenses. Ground truth for understanding why memory corruption persists.

### "Why Johnny Can't Encrypt" (USENIX Security 1999)
- **Authors:** Alma Whitten, J. D. Tygar
- **Why it matters:** Classic usability study showing that even technically competent users fail to use PGP correctly. Established the field of security usability.

---

*Last reviewed: 2026-06. Maintained by SECURITY_AGENT.*
