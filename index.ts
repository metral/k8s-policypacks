import * as aws from "@pulumi/aws";
import { PolicyPack, ReportViolation, validateResourceOfType } from "@pulumi/policy";

// Create a new Policy Pack.
const policies = new PolicyPack("policy-pack-typescript", {
    // Specify the Policies in the Policy Pack.
    policies: [{
        // The name for the Policy must be unique within the Pack.
        name: "s3-no-public-read",

        // The description should document what the Policy does and why it exists.
        description: "Prohibits setting the publicRead or publicReadWrite permission on AWS S3 buckets.",

        // The enforcement level can be "advisory", "mandatory", or "disabled". An "advisory" enforcement level
        // simply prints a warning for users, while a "mandatory" policy will block an update from proceeding, and
        // "disabled" disables the policy from running.
        enforcementLevel: "mandatory",

        // The validateResourceOfType function allows you to filter resources. In this case, the rule only
        // applies to S3 buckets and reports a violation if the acl is "public-read" or "public-read-write".
        validateResource: validateResourceOfType(aws.s3.Bucket, (bucket, args, reportViolation) => {
            if (bucket.acl === "public-read" || bucket.acl === "public-read-write") {
                reportViolation(
                    "You cannot set public-read or public-read-write on an S3 bucket. " +
                    "Read more about ACLs here: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html");
            }
        }),
    }],
});

