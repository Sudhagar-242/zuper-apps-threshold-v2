import React, { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";

const steps = [
  {
    path: "add-goals-tab", // relative to /app/configuration
    title: "Goal rules",
    info: "Active goals",
    icon: (
      <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
        <path d="M11.276 3.5a3.75 3.75 0 0 0-2.701 1.149l-4.254 4.417a2.75 2.75 0 0 0 .036 3.852l2.898 2.898a2.5 2.5 0 0 0 3.502.033l.45-.434a.75.75 0 1 0-1.04-1.08l-.45.434a1 1 0 0 1-1.401-.014l-2.898-2.898a1.25 1.25 0 0 1-.016-1.75l4.253-4.418a2.25 2.25 0 0 1 1.62-.689h1.975c.966 0 1.75.784 1.75 1.75v2.371c0 .358-.146.7-.403.948a.75.75 0 1 0 1.04 1.08 2.81 2.81 0 0 0 .863-2.028v-2.371a3.25 3.25 0 0 0-3.25-3.25h-1.974Z"></path>
        <path d="M13 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
        <path d="M14.75 12a.75.75 0 0 1 .75.75v1.25h1.25a.75.75 0 0 1 0 1.5h-1.25v1.25a.75.75 0 0 1-1.5 0v-1.25h-1.25a.75.75 0 0 1 0-1.5h1.25v-1.25a.75.75 0 0 1 .75-.75Z"></path>
      </svg>
    ),
  },
  {
    path: "add-goals", // relative to /app/configuration
    title: "Goal rules",
    info: "Active goals",
    icon: (
      <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
        <path d="M11.276 3.5a3.75 3.75 0 0 0-2.701 1.149l-4.254 4.417a2.75 2.75 0 0 0 .036 3.852l2.898 2.898a2.5 2.5 0 0 0 3.502.033l.45-.434a.75.75 0 1 0-1.04-1.08l-.45.434a1 1 0 0 1-1.401-.014l-2.898-2.898a1.25 1.25 0 0 1-.016-1.75l4.253-4.418a2.25 2.25 0 0 1 1.62-.689h1.975c.966 0 1.75.784 1.75 1.75v2.371c0 .358-.146.7-.403.948a.75.75 0 1 0 1.04 1.08 2.81 2.81 0 0 0 .863-2.028v-2.371a3.25 3.25 0 0 0-3.25-3.25h-1.974Z"></path>
        <path d="M13 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
        <path d="M14.75 12a.75.75 0 0 1 .75.75v1.25h1.25a.75.75 0 0 1 0 1.5h-1.25v1.25a.75.75 0 0 1-1.5 0v-1.25h-1.25a.75.75 0 0 1 0-1.5h1.25v-1.25a.75.75 0 0 1 .75-.75Z"></path>
      </svg>
    ),
  },
];

const Configuration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(steps[0].path, { replace: true });
  }, []);

  return (
    <s-page>
      <s-box paddingInlineStart="small" paddingBlockStart="large">
        <s-stack alignItems="center" gap="large small-300" direction="inline">
          <s-button icon="arrow-left" accessibilityLabel="back" href="/app" />
          <s-heading>Goal Configuration</s-heading>
        </s-stack>
      </s-box>

      {/* Tabs */}
      <s-section>
        <s-stack direction="inline" gap="large small-300">
          {steps.map((step, index) => (
            <s-box key={index}>
              <NavLink to={step.path} style={{ textDecoration: "none" }}>
                {({ isActive }) => (
                  <s-clickable
                    border="base"
                    padding="small-400"
                    background={isActive ? "strong" : "subdued"}
                    borderRadius="base"
                  >
                    <s-stack
                      direction="inline"
                      alignItems="center"
                      gap="small-200"
                    >
                      <s-icon type="home" />
                      <s-stack alignItems="start">
                        <s-heading>{step.title}</s-heading>
                        <s-paragraph>{step.info}</s-paragraph>
                      </s-stack>
                    </s-stack>
                  </s-clickable>
                )}
              </NavLink>
            </s-box>
          ))}
        </s-stack>
      </s-section>

      {/* Tab content */}
      <Outlet />
    </s-page>
  );
};

export default Configuration;
