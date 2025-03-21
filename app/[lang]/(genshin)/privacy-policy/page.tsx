import { routing } from "@i18n/routing";

export const dynamic = "force-static";
export const runtime = "edge";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy",
};

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export default async function PrivacyPolicy() {
  return (
    <div className="card">
      <article className="prose prose-invert max-w-none">
        <p>Effective date: June 15, 2023</p>
        <p>
          Genshin-Builds &#40;&quot;us&quot;, &quot;we&quot;, or
          &quot;our&quot;&#41; operates the{" "}
          <a href="https://genshin-builds.com/">https://genshin-builds.com/</a>{" "}
          website &#40;hereinafter referred to as the &quot;Service&quot;&#41;.
        </p>
        <p>
          This page informs you of our policies regarding the collection, use,
          and disclosure of personal data when you use our Service and the
          choices you have associated with that data. Our Privacy Policy for
          Genshin-Builds is managed with the help of{" "}
          <a href="https://privacypolicies.com/free-privacy-policy-generator/">
            Privacy Policies
          </a>
          .
        </p>
        <p>
          We use your data to provide and improve the Service. By using the
          Service, you agree to the collection and use of information in
          accordance with this policy. Unless otherwise defined in this Privacy
          Policy, the terms used in this Privacy Policy have the same meanings
          as in our Terms and Conditions, accessible from{" "}
          <a href="https://genshin-builds.com/">https://genshin-builds.com/</a>
        </p>
        <h2 id="information-collection-and-use">
          Information Collection And Use
        </h2>
        <p>
          We collect several different types of information for various purposes
          to provide and improve our Service to you.
        </p>
        <h3 id="types-of-data-collected">Types of Data Collected</h3>
        <h4 id="personal-data">Personal Data</h4>
        <p>
          While using our Service, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you &#40;&quot;Personal Data&quot;&#41;. Personally
          identifiable information may include, but is not limited to:
        </p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Cookies and Usage Data</li>
        </ul>
        <h4 id="usage-data">Usage Data</h4>
        <p>
          We may also collect information on how the Service is accessed and
          used &#40;&quot;Usage Data&quot;&#41;. This Usage Data may include
          information such as your computer&#39;s Internet Protocol address
          &#40;e.g. IP address&#41;, browser type, browser version, the pages of
          our Service that you visit, the time and date of your visit, the time
          spent on those pages, unique device identifiers, and other diagnostic
          data.
        </p>
        <h4 id="tracking--cookies-data">Tracking &amp; Cookies Data</h4>
        <p>
          We use cookies and similar tracking technologies to track the activity
          on our Service and hold certain information.
        </p>
        <p>
          Cookies are files with a small amount of data which may include an
          anonymous unique identifier. Cookies are sent to your browser from a
          website and stored on your device. Tracking technologies also used are
          beacons, tags, and scripts to collect and track information and to
          improve and analyze our Service.
        </p>
        <p>
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies,
          you may not be able to use some portions of our Service. You can learn
          more about how to manage cookies in the{" "}
          <a href="https://privacypolicies.com/blog/how-to-delete-cookies/">
            Browser Cookies Guide
          </a>
          .
        </p>
        <p>Examples of Cookies we use:</p>
        <ul>
          <li>
            <strong>Session Cookies.</strong> We use Session Cookies to operate
            our Service.
          </li>
          <li>
            <strong>Preference Cookies.</strong> We use Preference Cookies to
            remember your preferences and various settings.
          </li>
          <li>
            <strong>Security Cookies.</strong> We use Security Cookies for
            security purposes.
          </li>
        </ul>
        <p>
          For more information on the cookies we use, please refer to our{" "}
          <a href="https://www.genshin-builds.com/cookie-policy/">
            Cookie Policy
          </a>
          .
        </p>
        <h3 id="third-party-cookies-and-data-tracking-for-advertising-purposes">
          Third-Party Cookies and Data Tracking for Advertising Purposes
        </h3>
        <p>
          We work with third-party advertising companies, such as Freestar, to
          display advertisements on our Service. These companies may use cookies
          and similar tracking technologies to collect information about your
          browsing activities over time and across different websites for the
          purpose of delivering targeted advertising.
        </p>
        <p>
          To learn more about how these companies collect and use your
          information for advertising purposes, and to understand your choices
          regarding such practices, please review their respective privacy
          policies:
        </p>
        <ul>
          <li>
            <a href="https://freestar.com/privacy-policy/">
              Freestar Privacy Policy
            </a>
          </li>
        </ul>
        <p>
          Please note that we do not have control over the cookies and tracking
          technologies used by these third-party advertising companies.
          Therefore, this Privacy Policy does not cover the use of cookies and
          tracking technologies by any third-party advertisers.
        </p>
        <p>
          You can opt out of receiving targeted advertising from participating
          companies through the{" "}
          <a href="http://optout.networkadvertising.org/">
            NAI Consumer Opt-Out
          </a>{" "}
          page.
        </p>
        <h3 id="use-of-data">Use of Data</h3>
        <p>Genshin-Builds uses the collected data for various purposes:</p>
        <ul>
          <li>To provide and maintain the Service</li>
          <li>To notify you about changes to our Service</li>
          <li>
            To allow you to participate in interactive features of our Service
            when you choose to do so
          </li>
          <li>To provide customer care and support</li>
          <li>
            To provide analysis or valuable information so that we can improve
            the Service
          </li>
          <li>To monitor the usage of the Service</li>
          <li>To detect, prevent, and address technical issues</li>
        </ul>
        <h2 id="compliance-with-applicable-privacy-regulations">
          Compliance with Applicable Privacy Regulations
        </h2>
        <p>
          Genshin-Builds is committed to complying with all applicable privacy
          regulations, including but not limited to the General Data Protection
          Regulation &#40;GDPR&#41; for EU users and the California Consumer
          Privacy Act &#40;CCPA&#41; for California users.
        </p>
        <p>
          If you are a user located in the European Economic Area &#40;EEA&#41;,
          we process your personal data based on the legal grounds provided by
          the GDPR. We ensure that adequate safeguards are in place when
          transferring your personal data outside the EEA.
        </p>
        <h2 id="disclosure-of-data">Disclosure Of Data</h2>
        <h3 id="legal-requirements">Legal Requirements</h3>
        <p>
          Genshin-Builds may disclose your Personal Data in the good faith
          belief that such action is necessary to:
        </p>
        <ul>
          <li>To comply with a legal obligation</li>
          <li>
            To protect and defend the rights or property of Genshin-Builds
          </li>
          <li>
            To prevent or investigate possible wrongdoing in connection with the
            Service
          </li>
          <li>
            To protect the personal safety of users of the Service or the public
          </li>
          <li>To protect against legal liability</li>
        </ul>
        <h2 id="security-of-data">Security Of Data</h2>
        <p>
          The security of your data is important to us, but remember that no
          method of transmission over the Internet or method of electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your Personal Data, we cannot guarantee its absolute
          security.
        </p>
        <h2 id="service-providers">Service Providers</h2>
        <p>
          We may employ third-party companies and individuals to facilitate our
          Service &#40;&quot;Service Providers&quot;&#41;, provide the Service
          on our behalf, perform Service-related services, or assist us in
          analyzing how our Service is used.
        </p>
        <p>
          These third parties have access to your Personal Data only to perform
          these tasks on our behalf and are obligated not to disclose or use it
          for any other purpose.
        </p>
        <h3 id="analytics">Analytics</h3>
        <p>
          We may use third-party Service Providers to monitor and analyze the
          use of our Service.
        </p>
        <ul>
          <li>
            <p>
              <strong>Google Analytics</strong>
            </p>
            <p>
              Google Analytics is a web analytics service offered by Google that
              tracks and reports website traffic. Google uses the data collected
              to track and monitor the use of our Service. This data is shared
              with other Google services. Google may use the collected data to
              contextualize and personalize the ads of its advertising network.
            </p>
            <p>
              You can opt-out of having made your activity on the Service
              available to Google Analytics by installing the Google Analytics
              opt-out browser add-on. The add-on prevents Google Analytics
              JavaScript &#40;ga.js, analytics.js, and dc.js&#41; from sharing
              information with Google Analytics about visits activity.
            </p>
            <p>
              For more information on the privacy practices of Google, please
              visit the Google Privacy &amp; Terms web page:{" "}
              <a href="https://policies.google.com/privacy?hl=en">
                https://policies.google.com/privacy?hl=en
              </a>
            </p>
          </li>
        </ul>
        <h3 id="advertising">Advertising</h3>
        <p>
          We use third-party advertising companies, including Freestar, to serve
          advertisements when you visit our Service.
        </p>
        <ul>
          <li>
            <p>
              <strong>Freestar</strong>
            </p>
            <p>
              Freestar is an advertising technology company that serves
              advertisements on our Service. To learn more about Freestar&#39;s
              privacy practices and to understand your choices regarding
              targeted advertising, please review their privacy policy:{" "}
              <a href="https://freestar.com/privacy-policy/">
                https://freestar.com/privacy-policy/
              </a>
            </p>
          </li>
        </ul>
        <h2 id="links-to-other-sites">Links To Other Sites</h2>
        <p>
          Our Service may contain links to other sites that are not operated by
          us. If you click on a third-party link, you will be directed to that
          third party&#39;s site. We strongly advise you to review the Privacy
          Policy of every site you visit.
        </p>
        <p>
          We have no control over and assume no responsibility for the content,
          privacy policies, or practices of any third-party sites or services.
        </p>
        <h2 id="childrens-privacy">Children&#39;s Privacy</h2>
        <p>
          Our Service does not address anyone under the age of 13
          &#40;&quot;Children&quot;&#41;.
        </p>
        <p>
          We do not knowingly collect personally identifiable information from
          anyone under the age of 13. If you are a parent or guardian and you
          are aware that your Children have provided us with Personal Data,
          please contact us. If we become aware that we have collected Personal
          Data from children without verification of parental consent, we take
          steps to remove that information from our servers.
        </p>
        <h2 id="changes-to-this-privacy-policy">
          Changes To This Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>
        <p>
          We will let you know via email and/or a prominent notice on our
          Service, prior to the change becoming effective and update the
          &quot;effective date&quot; at the top of this Privacy Policy.
        </p>
        <p>
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </p>
        <h2 id="contact-us">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us:
        </p>
        <ul>
          <li>
            By email:{" "}
            <a href="mailto:genshinbuildscom@gmail.com">
              GenshinBuildscom@gmail.com
            </a>
          </li>
        </ul>
      </article>
    </div>
  );
}
