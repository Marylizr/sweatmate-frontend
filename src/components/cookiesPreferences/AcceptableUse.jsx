import React from 'react';
import PoliciesMenu from './PoliciesMenu';
import styles from './AcceptableUse.module.css';
import NavBar from '../navBar/navBar';

const AcceptableUse = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.policyWrapper}>
      <PoliciesMenu />
        <h2 className={styles.title}>SweatMate Acceptable Use Policy</h2>
        <p className={styles.lastUpdated}><strong>Last revised:</strong> January 30, 2025</p>

        <div className={styles.policyContent}>
          <h3>1. Introduction</h3>
          <p>Welcome to <strong>SweatMate</strong>! To ensure a safe and professional environment for trainers and clients, we have outlined clear guidelines for acceptable use.</p>
          <p>By using SweatMate, you agree to follow this policy. Violating these rules may result in account suspension or termination.</p>

          <h3>2. Things You Must Do</h3>
          <ul>
            <li>Comply with our <strong>Terms and Conditions</strong> and applicable laws.</li>
            <li>Use the platform in a <strong>professional and respectful manner</strong>.</li>
            <li>Provide accurate account information.</li>
            <li>Ensure all personal data collection complies with our <strong>Privacy Policy</strong>.</li>
          </ul>

          <h3>3. Prohibited Activities</h3>
          <h4>3.1 Illegal or Harmful Activities</h4>
          <ul>
            <li>Using SweatMate for <strong>fraud, harassment, or unlawful activities</strong>.</li>
            <li>Disseminating content that is <strong>offensive, violent, or illegal</strong>.</li>
            <li>Engaging in scams, phishing, or misleading promotions.</li>
          </ul>

          <h4>3.2 Security Violations</h4>
          <ul>
            <li>Attempting to <strong>hack, modify, or reverse-engineer</strong> the platform.</li>
            <li>Using unauthorized software, bots, or scripts to scrape or access data.</li>
            <li>Interfering with system performance, launching denial-of-service (DoS) attacks.</li>
          </ul>

          <h4>3.3 Privacy Violations</h4>
          <ul>
            <li>Collecting, storing, or sharing **user data without consent**.</li>
            <li>Disclosing private information without proper authorization.</li>
          </ul>

          <h4>3.4 Intellectual Property Violations</h4>
          <ul>
            <li>Uploading, distributing, or using **unauthorized copyrighted material**.</li>
            <li>Misrepresenting ownership of content.</li>
          </ul>

          <h3>4. Enforcement & Consequences</h3>
          <ul>
            <li>SweatMate reserves the right to <strong>investigate and take action</strong> on any policy violations.</li>
            <li>We may <strong>remove content, suspend, or terminate accounts</strong> that violate this policy.</li>
            <li>Severe violations may be reported to <strong>law enforcement agencies</strong>.</li>
          </ul>

          <h3>5. Indemnification</h3>
          <p>You agree to indemnify and hold harmless SweatMate from any claims, damages, or losses arising from violations of this policy.</p>

          <h3>6. Reporting Violations</h3>
          <p>If you notice any violation of this policy, please report it to <a href="mailto:support@sweatmate.io">support@sweatmate.io</a>.</p>

          <h3>7. Policy Updates</h3>
          <p>We may update this policy periodically. Continued use of SweatMate after updates means you accept the revised policy.</p>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.acceptButton}>I Accept</button>
          <button className={styles.declineButton}>I Decline</button>
        </div>
      </div>
    </div>
  );
};

export default AcceptableUse;
