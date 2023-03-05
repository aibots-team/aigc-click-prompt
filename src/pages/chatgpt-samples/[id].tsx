import type { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import { Box, Flex, Heading, Link, Spacer, Tooltip } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import CopyComponent from "@/components/CopyComponent";
import SimpleMarkdown from "@/components/SimpleMarkdown";
import { ChatGptIcon } from "@/components/CustomIcon";

export const getStaticPaths: GetStaticPaths = async () => {
  const index = await import("@/assets/chatgpt/samples/index.json").then((mod) => mod.default);
  const paths = index.map((item) => item.path);

  return {
    paths: paths.map((it) => ({ params: { id: it.split(".").slice(0, -1).join(".") } })),
    fallback: true,
  };
};

interface Sample {
  name: string;
  description: string;
  category: string;
  author: string;
  homepage: string;
  preview: string;
  steps: {
    ask: string;
    response: string;
  }[];
}

interface Props {
  content: Sample;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params === undefined) {
    return {
      props: {},
    };
  }

  const { id } = params;
  const content: Sample = await import(`@/assets/chatgpt/samples/${id}.yml`).then((mod) => mod.default);
  return { props: { content } };
};

export default function Sample({ content }: Props) {
  return (
    <>
      {content && (
        <>
          <Heading as='h4'>
            {content.name} by &nbsp;
            <Link href={content.homepage} isExternal>
              {content.author} <ExternalLinkIcon />
            </Link>
          </Heading>
          <Spacer />
          <Box>
            {content.steps.map((step, index) => (
              <>
                <HumanBlock gap={2}>
                  {/*<QuestionIcon boxSize={22} />*/}
                  <CopyComponent value={step.ask} />
                  <SimpleMarkdown content={step.ask?.replaceAll("\n", "\n\n")} />
                  <Tooltip label='Open In ChatGPT'>
                    <Link href={"https://chat.openai.com/"} isExternal>
                      <ExternalLinkIcon boxSize={22} />
                    </Link>
                  </Tooltip>
                </HumanBlock>
                <AiBlock>
                  <Box>
                    <ChatGptIcon />
                  </Box>
                  <Box ml='2'>
                    <SimpleMarkdown content={step.response?.replaceAll("\n", "\n\n")} />
                  </Box>
                </AiBlock>
              </>
            ))}
          </Box>
        </>
      )}
    </>
  );
}

const HumanBlock = styled(Flex)`
  background-color: rgba(247, 247, 248);
  border-color: rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const AiBlock = styled(Flex)`
  background-color: #fff;
  padding: 1rem;
`;
