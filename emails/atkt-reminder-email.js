const AtktReminderEmail = ({
  name,
  subject,
  lastDate,
}) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  </head>

  <body
    style="
      background-color: #f6f9fc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Ubuntu, sans-serif;
    "
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        background-color: #ffffff;
        margin: 0 auto;
        padding: 20px 0 48px;
        margin-bottom: 64px;
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding: 0 48px"
            >
              <tbody>
                <tr>
                  <td>
                    <img
                      alt="UCOE"
                      height="40"
                      src="https://universalcollegeofengineering.edu.in/wp-content/uploads/2019/07/UCoE-Web-Logo.png"
                      style="
                        display: block;
                        outline: none;
                        border: none;
                        text-decoration: none;
                      "
                    />
                    <hr
                      style="
                        width: 100%;
                        border: none;
                        border-top: 1px solid #eaeaea;
                        border-color: #e6ebf1;
                        margin: 20px 0;
                      "
                    />
                    <p
                      style="
                        font-size: 16px;
                        line-height: 24px;
                        margin: 16px 0;
                        color: #525f7f;
                        text-align: left;
                      "
                    >
                      Hello <b>${name}</b>,
                    </p>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 24px;
                        margin: 16px 0;
                        color: #525f7f;
                        text-align: left;
                      "
                    >
                      This is a reminder email for ATKT form submission for
                      <b>${subject}</b>
                      <!-- -->subject. If you wish to fill the form please visit
                      examcell on or before <b>${lastDate}</b>
                    </p>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 24px;
                        margin: 16px 0;
                        color: #525f7f;
                        text-align: left;
                      "
                    >
                      — UCOE Examcell
                    </p>
                    <hr
                      style="
                        width: 100%;
                        border: none;
                        border-top: 1px solid #eaeaea;
                        border-color: #e6ebf1;
                        margin: 20px 0;
                      "
                    />
                    <p
                      style="
                        font-size: 12px;
                        line-height: 16px;
                        margin: 16px 0;
                        color: #8898aa;
                      "
                    >
                      Kaman Bhiwandi Road, Vasai, Palghar 401 208
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;

module.exports = AtktReminderEmail;
