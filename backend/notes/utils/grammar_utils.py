import anthropic
import json
from django.conf import settings
from .markdown_utils import strip_markdown


client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """
You are a grammar checker. Analyze the given text for grammar, spelling, and punctuation errors.

You must return ONLY a valid JSON object in exactly this format, with no extra text, no explanations outside the JSON, and no markdown backticks:

{
    "issues": [
        {
            "error": "the incorrect word or phrase from the text",
            "suggestion": "the corrected version",
            "explanation": "brief explanation of why it is wrong"
        }
    ],
    "overall": "a one sentence summary of the grammar quality"
}

If there are no issues found, return an empty issues array and positive overall message.
"""

def grammar_check(content):
    plain_text = strip_markdown(content)

    try:
        response = client.messages.create(
            model='claude-opus-4-6',
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=[{'role': 'user', 'content': plain_text}]
        )
    except anthropic.APIConnectionError:
        return {'error': 'Could not connect to Claude. Check internet connection.'}
    except anthropic.AuthenticationError:
        return {'error': 'Invalid API key. Check ANTHROPIC_API_KEY setting.'}
    except anthropic.RateLimitError:
        return {'error': 'Rate limit reached. Please wait a moment and try again.'}
    except anthropic.APIStatusError as e:
        return {'error': f'Claude API error: {e.status_code}'}
    
    if not response.content:
        return {'error': 'Claude returned an empty response.'}
    
    try:
        result = json.loads(response.content[0].text)
    except json.JSONDecodeError:
        return {'error': 'Claude returned an invalid response. Please try again.'}
    
    if 'issues' not in result or 'overall' not in result:
        return {'error': 'Claude returned an unexpected response format.'}

    return result
